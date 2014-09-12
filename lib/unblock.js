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
  // assign the cachedUnblock
  sub.unblock = cachedUnblock;

  if(subId) {
    self._namedSubs[subId] = sub;
  } else {
    self._universalSubs.push(sub);
  }
  sub._runHandler();
};