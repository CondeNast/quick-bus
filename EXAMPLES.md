# Examples

Event Buses are very low-level data structures (similar to Promises), and are often a building block for larger data structures that are more useful.

### Example 1

For measuring the performance of various events, one could do something like this:

```js
function () {
  var starts = {};
  var performance = {};

  function onStart(topic) {
    topic = topic.slice(0, -6); // remove '.start' from the string
    starts[topic] = Date.now();
  }

  function onEnd(topic) {
    topic = topic.slice(0, -4); // remove '.end' from the string
    performance[topic] = Date.now() - starts[topic];
  }

  bus.on('*.start', onStart);
  bus.on('*.end', onEnd);

  return performance;
}
```

### Example 2

For collecting a series of events to create a larger event:

```js
var collection = [];

bus.on('*.someSmallEvent.*', function (topic, message) {
  collection.push(message);
});

bus.on('*.someSmallEvent.done', function () {
  // take all the small events
  bus.emit('someGroup.someBigEvent', collection);
  collection = [];
});
```

### Example 3

For remembering only the last event per topic in a group:

```js
var lastEvents = {};

bus.on('someGroup.#', function (topic, message) {
  lastEvents[topic] = message;
})
```

### Example 4

To do some work after some time has passed after some images have loaded

```js
var imageList = [];
var AfterDelay = function (fn, interval) {
  var timerRef;

  function reset() {
    if (timerRef) {
      clearTimeout(timerRef);
    }
    timerRef = setTimeout(function () {
      if (timerRef) {
        clearTimeout(timerRef);
        timerRef = undefined;
      }
      fn();
    }, interval);
  }

  reset();

  this.reset = reset;
}

var afterDelay = new AfterDelay(function () {
  // do something to images

  // reset images
  imageList = [];
})

bus.on('images.#', function (topic, imageElement) {
  imageList.push(imageElement);
});
```

And then in the jsx or wherever there are images being loaded

```jsx
function onLoad(e) {
  var src = e.currentTarget.getAttribute('src');
  bus.emit('images.loaded', e.currentTarget);
}

// add the onLoad to all the images you want to remember
<img src="..." onLoad={onLoad}">
```

### Example 5

To only act if something else on the page finished

```js
function someWork() {
  // do some work
}

// only do work after something else has finished
var isSomethingElseDone = bus.history('someGroup.somethingElse.done').length > 0;
if (isSomethingElseDone) {
  someWork();
} else {
  bus.on('someGroup.somethingElse.done', someWork);
}
```

If you have other fun examples of data structures and patterns to use with an event bus, submit your own in a PR!
