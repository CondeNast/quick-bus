# Quick Bus 🚌

A tiny event bus with AMQP and Postal.js-like functionality meant to be used on the client-side.

[![license](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](LICENSE)

_Proudly built by:_

<a href="https://technology.condenast.com"><img src="https://user-images.githubusercontent.com/1215971/35070721-3f136cdc-fbac-11e7-81b4-e3aa5cc70a17.png" title="Conde Nast Technology" width=350/></a>

### What is it?

This is a simple event bus that replicates the basics of Postal.js in about 80 lines of code (minified to 773 bytes)

It doesn't use lists of regex like Postal does but uses a directed graph instead, which is _much_ faster.

It adds a history for automatic metrics collection, which brings the line count to about 150 lines of code (minified to 1258 bytes)

It has no dependencies.

### How to use

Use the `emit` and `on` methods, just like a regular event emitter.

```js
var channel = new Bus();

channel.on('metrics.#', function (topic, msg) {
  console.log(topic, msg);
});

channel.emit('metrics.page.loaded', 'hello world');
```

In imitation of Postal.js, use the returned function to stop the events.

```js
var off = channel.on('page.load.justOnce', function (topic, msg) {
  console.log(topic, msg);
  off();
});
```

If you like the pub/sub model better, we've aliased `subscribe` and `publish` as well:

```js
var channel = new Bus();

channel.subscribe('metrics.#', function (topic, msg) {
  console.log(topic, msg);
});

channel.publish('metrics.page.loaded', 'hello world');
```

And of course to unsubscribe, use the returned function:

```js
var unsubscribe = channel.subscribe('#', function (topic, msg) {
  console.log(Date.now(), topic, msg);
});

for (var i = 0; i < 10; i++) {
  channel.publish('welcome.' + i, 'hello world!');
}

unsubscribe();
```

### How it works

A Bus builds a directed graph of subscriptions.  As event topics are published, the graph discovers all the subscribers to notify and then caches the results for faster message publishing in the future.  When a new subscriber is added, the graph is modified and the subscriber cache is reset.

### Wildcard subscriptions

Supports same wildcards as Postal.js, such as:

#### Zero or more words using `#`

```js
channel.subscribe('#.changed', function (topic, msg) {
  // ...
});
channel.emit('what.has.changed', event);
```

```js
channel.subscribe('metrics.#.changed', function (topic, msg) {
  // ...
});
channel.emit('metrics.something.important.has.changed', event);
```

#### Single word using `*`

```js
channel.subscribe('ads.slot.*.filled', function (topic, msg) {
  // ...
});
channel.emit('ads.slot.post-nav.filled', {data, msg});
```

### History

We keep a history of the events that have been emitted.  They can be queried with the `history` method:

```js
var channel = new Bus();

channel.emit('ads.slot.post-nav.filled', {data, msg});
channel.emit('ads.slot.side-rail.filled', {thing, stuff});
channel.emit('ads.slot.instream-banner-0.filled', {a, b});
channel.emit('metrics.component.absdf2324.render.start', {etc, ie});
channel.emit('metrics.component.absdf2324.render.end', {etc, ie});

// gets the ad slots that were filled
var history = channel.history('ads.slot.*.filled');

// gets history of components rendering
var history = channel.history('metrics.component.*.render.*');
```

The format is an array of arrays.  For example:
```json
[
  ["ads.slot.post-nav.filled", 1515714470550],
  ["ads.slot.side-rail.filled", 1515714470559],
  ["ads.slot.instream-banner-0.filled", 1515714500268],
  ["metrics.component.absdf2324.render.start", 1515714782584],
  ["metrics.component.absdf2324.render.end", 1515714790507],
]
```

Only the topic and the timestamp of each event is stored.  We don't store the message/payload in the history to prevent potential memory leaks and scoping issues.

These events are stored in a ring buffer, so old events will be dropped from the history once it reaches a certain size.  The history size is current set to a maximum of 9999 events.

Note that this feature is designed for _metrics_, and often the information that people are interested in for metrics can be included as part of the topic.  For example, if you have a subscriber of `on('components.*.render.start')`, then you can have an infinite number of component ids such as `emit('components.abcdef.render.start')` and `emit('components.someRandomId.render.start')` without any additional complexity or performance penalty to the event bus.  If you're trying to access more information that can't be included as part of the topic, then you should make a subscriber and log that information.

Look at our [Examples Page](https://github.com/CondeNast/quick-bus/blob/master/EXAMPLES.md) for some common code patterns with event buses.

### To Do

- Determine if there is a need to unsubscribe from events, or if it is not worth the cost
- Determine if the "meta" field from Postal.js should be included, or if that's just weight that the Promise API hates
- Should we expose timing information or the ids of messages?
- Would an async mechanism that would collect, buffer, or throttle messages be useful?  Would an event queue be used?
- Are there other features of Postal that we actually use?

### Future / Related architecture

- Create helper library specialized in producing events from React
- Create library to link into Browser events (Boomerang)
- Create library to collect events and forward them to servers such as Sparrow, GA or BoomCatch.

### Related Documents

- [License - Apache 2.0](https://github.com/CondeNast/quick-bus/blob/master/LICENSE.md)
- [Code of Conduct - Contributor Covenant v1.4](https://github.com/CondeNast/quick-bus/blob/master/CODE_OF_CONDUCT.md)
- [Contributing Guidelines - Atom and Rails](https://github.com/CondeNast/quick-bus/blob/master/CONTRIBUTING.md)

### Related Topics

- [RabbitMX Topic Exchange tutorial explaining * and # wildcards](https://www.rabbitmq.com/tutorials/tutorial-five-javascript.html)
