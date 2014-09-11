var originalSub = MeteorX.Session.prototype.protocol_handlers.sub;
MeteorX.Session.prototype.protocol_handlers.sub = function(msg, unblock) {
  var self = this;
  // assign unblock to the session, so we can capture it later
  // we will use unblock in current eventLoop, so this is safe
  self.__unblock = unblock;
  originalSub.call(self, msg, unblock);
};

// We simply replace current implementation with a simple modification
// to add add the unblock
MeteorX.Session.prototype._startSubscription = function (handler, subId, params, name) {
  var self = this;
  var sub = new MeteorX.Subscription(self, handler, subId, params, name);
  // assign unblock we carried via the session
  sub.unblock = self.__unblock;

  if(subId) {
    self._namedSubs[subId] = sub;
  } else {
    self._universalSubs.push(sub);
  }
  sub._runHandler();
};