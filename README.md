[![](https://api.travis-ci.org/meteorhacks/unblock.svg)](https://travis-ci.org/meteorhacks/unblock)

# Use this.unblock inside Meteor Publications

This is a project to provide `this.unblock` functionality to publications.
`this.unblock` inside publications is one of most(may be a little bit less) [requested](https://github.com/meteor/meteor/issues/853) feature and but it hasn't been implemented yet!

So, this project implements that feature as a community package thanks to the [`MeteorX`](https://github.com/meteorhacks/meteorx) project.

## Why unblock?

Meteor executes, DDP messages for a single client in a sequence. So, if one message takes a lot of time to process, that time will add up to all the messages. Luckily, there is an API called `this.unblock` which can be use inside methods as shown below.

```js
Meteor.methods({
  longMethod: function() {
    this.unblock();
    Meteor._sleepForMs(1000 * 60 * 60);
  }
});
```
So, other messages can start processing without waiting for the above method.

**Unfortunately**, this is not available for Publications(subscriptions) for no reason. But now you can possible it with this project.

## Usage

Install following package into your Meteor app.
```
meteor add meteorhacks:unblock

// for older Meteor versions
mrt add unblock
```

Use it inside your publications, if that takes too much time or you don't need subscriptions from other publications to wait on this.

```
Meteor.publish('myLongPublications', function() {
  this.unblock(); //yeah!
  Meteor._sleepForMs(1000 * 60 * 60);
});
```
