Tinytest.addAsync('this.unblock availability', function(test, done) {
  var id = Random.id();
  var conn = DDP.connect(process.env.ROOT_URL);
  Meteor.publish(id, function() {
    test.equal(typeof this.unblock, 'function');
    done();
    conn.close();
  });

  conn.subscribe(id);
});

Tinytest.addAsync('functionality check - wait forever without unblock', function(test, done) {
  var id1 = Random.id();
  var id2 = Random.id();
  var conn = DDP.connect(process.env.ROOT_URL);
  var subProcessing = [];

  Meteor.publish(id1, function() {
    subProcessing.push(id1);
    Meteor._sleepForMs(1000 * 60 * 60);
  });

  Meteor.publish(id2, function() {
    subProcessing.push(id2);
  });

  conn.subscribe(id1);
  conn.subscribe(id2);

  Meteor.setTimeout(function() {
    test.equal(subProcessing, [id1]);
    done();
    conn.close();
  }, 400);
});

Tinytest.addAsync('functionality check - no waiting with unblock', function(test, done) {
  var id1 = Random.id();
  var id2 = Random.id();
  var conn = DDP.connect(process.env.ROOT_URL);
  var subProcessing = [];

  Meteor.publish(id1, function() {
    subProcessing.push(id1);
    this.unblock();
    Meteor._sleepForMs(1000 * 60 * 60);
  });

  Meteor.publish(id2, function() {
    subProcessing.push(id2);

    test.equal(subProcessing, [id1, id2]);
    done();
    conn.close();
  });

  conn.subscribe(id1);
  conn.subscribe(id2);
});

Tinytest.addAsync('cleanup - unsub before completing the sub', function(test, done) {
  var id1 = Random.id();
  var id2 = Random.id();
  var conn = DDP.connect(process.env.ROOT_URL);
  var subProcessing = [];

  Meteor.publish(id1, function() {
    this.ready();
    this.unblock();
    Meteor._sleepForMs(500);
    this.onStop(function() {
      done();
      conn.close();
    });
  });

  var handle = conn.subscribe(id1, {onReady: function() {
    handle.stop();
  }});
});

Tinytest.addAsync('cleanup - unsub after completing the sub', function(test, done) {
  var id1 = Random.id();
  var id2 = Random.id();
  var conn = DDP.connect(process.env.ROOT_URL);
  var subProcessing = [];

  Meteor.publish(id1, function() {
    this.unblock();
    Meteor._sleepForMs(500);
    this.onStop(function() {
      done();
      conn.close();
    });
    this.ready();
  });

  var handle = conn.subscribe(id1, {onReady: function() {
    handle.stop();
  }});
});

Tinytest.addAsync('cleanup - unsub and onStop before the big message', function(test, done) {
  var id1 = Random.id();
  var id2 = Random.id();
  var conn = DDP.connect(process.env.ROOT_URL);
  var subProcessing = [];

  Meteor.publish(id1, function() {
    this.unblock();
    var compeletedSleep = false;
    this.onStop(function() {
      test.equal(compeletedSleep, false);
      done();
      conn.close();
    });
    Meteor._sleepForMs(500);
    compeletedSleep = true;
  });

  var handle = conn.subscribe(id1);
  setTimeout(function() {
    handle.stop();
  }, 200);
});