# Quick Bus

A tiny event bus with AMQP and Postal.js-like functionality meant to be used on the client-side.

### What is it?

This is a simple event bus that replicates the basics of Postal.js in about 80 lines of code.

It doesn't use lists of regex like Postal does but uses a directed graph instead, which is _much_ faster.

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

If you like the pub/sub model better, we've aliased `subscribe` and `publish` as well:

```js
var channel = new Bus();

channel.subscribe('metrics.#', function (topic, msg) {
  console.log(topic, msg);
});

channel.publish('metrics.page.loaded', 'hello world');
```

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

### To Do

- Determine if there is a need to unsubscribe from events, or if it is not worth the cost
- Determine if the "meta" field from Postal.js should be included, or if that's just weight that the Promise API hates
- Should we expose timing information or the ids of messages?
- Should we record a history so we can play back events that have already happened to late subscribers?  It would reduce the need for services to be concerned about when they are loaded.
- Would an async mechanism that would collect, buffer, or throttle messages be useful?  Would an event queue be used?
- Are there other features of Postal that we actually use?

### Future architecture

- Create helper library specialized in producing events from React
- Create library to link into Browser events (Boomerang)
- Create library to collect events and forward them to servers such as Sparrow, GA or BoomCatch.

### Related Documents

- License - Apache 2.0
- Code of Conduct - Contributor Covenant v1.4
- Contributing Guidelines - Atom and Rails
