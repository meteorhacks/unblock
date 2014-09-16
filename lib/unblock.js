var cachedUnblock;

var originalSub = MeteorX.Session.prototype.protocol_handlers.sub;
MeteorX.Session.prototype.protocol_handlers.sub = function(msg, unblock) {
  var self = this;
  // cacheUnblock temporarly, so we can capture it later
  // we will use unblock in current eventLoop, so this is safe
  cachedUnblock = unblock;
  originalSub.call(self, msg, unblock);
  // cleaning cached unblock
  cachedUnblock = null;
};

// We simply replace current implementation with a simple modification
// to add add the unblock
MeteorX.Session.prototype._startSubscription = function (handler, subId, params, name) {
  var self = this;
  var sub = new MeteorX.Subscription(self, handler, subId, params, name);

  var unblockHander = cachedUnblock;
  // _startSubscription may call from a lot places
  // so cachedUnblock might be null in somecases
  if(!unblockHander) {
    unblockHander = function() {}
  }
  // assign the cachedUnblock
  sub.unblock = unblockHander ;

  if(subId) {
    self._namedSubs[subId] = sub;
  } else {
    self._universalSubs.push(sub);
  }

  sub._runHandler();
};

// sometimes _runHandler will be called directly and 
// we won't have the session context and cachedUnblock
// so, those situations, set a dummy function for unblock
// this happens often when logging in and out
var originalRunHandler = MeteorX.Subscription.prototype._runHandler;
MeteorX.Subscription.prototype._runHandler = function() {
  if(!this.unblock) {
    this.unblock = function() {};
  }
  originalRunHandler.call(this);
}