# Event Emitters

[Events on Node.js API](https://nodejs.org/dist/latest-v8.x/docs/api/events.html#events_class_eventemitter)

The event emitter pattern is node.js vision of [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern). It allows you to decouple the producers and consumers of events using a standard interface.

## Synchronous event delivery

Since no I/O is envolved in emitting an event, event delivery is treated synchronously.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('Boltons in sight', () => {
  sensaSay('close the gate!');
});

myEmitter.on('Boltons in sight', () => {
  johnSay('draw your sword!');
});

console.log('before emit');
myEmitter.emit('Boltons in sight');
console.log('after emit');
```

Output will be :

```
before emit
Sensa says : close the gate!
John says : draw your sword!
after emit
```

> 📌 when emitting events, the listeners will be called before emitter.emit returns.

Event Emitters are a reliable way to orchestrate workflows

```js
myEmitter.on('Boltons in sight', () => {
  sensaSay('close the gate!');
  myEmitter.emit('call the gards');
});

myEmitter.on('Boltons in sight', () => {
  johnSay('draw your sword!');
  myEmitter.emit('on arms');
});

myEmitter.on('on arms', () => console.log('Arya draws Needle'));

myEmitter.on('on arms', () => console.log('John draws Longclaw'));

myEmitter.on('call the gards', () => console.log('gards ready'));

myEmitter.emit('Boltons in sight');
```

Output will be :

```
Sensa says : close the gate!
gards ready
John says : draw your sword!
Arya draws Needle
John draws Longclaw
```

> 📌 The EventEmitter calls all listeners synchronously in the order in which they were registered

When appropriate, listener functions can switch to an asynchronous mode of operation using the **setImmediate**

```js
myEmitter.on('Boltons in sight', () => {
  setImmediate(sensaSay, 'close the gate!');
});

console.log('before emit');
myEmitter.emit('Boltons in sight');
console.log('after emit');
```

Output will be :

```
before emit
after emit
Sensa says : close the gate!
```

When a listener is registered using the **eventEmitter.on** method, that listener will be invoked every time the named event is emitted. Using the **eventEmitter.once** method, it is possible to register a listener that is called at most once for a particular event.

```js
myEmitter.once('Boltons in sight', () => {
  sensaSay('For the north!');
});
myEmitter.on('Boltons in sight', () => {
  sensaSay('For the north!');
});

myEmitter.emit('Boltons in sight');
myEmitter.emit('Boltons in sight');
```

Output will be :

```
Sensa says : For the north!
Sensa says : close the gate!
Sensa says : close the gate!
```

When an error occurs within an EventEmitter instance, the typical action is for an 'error' event to be emitted.
If an EventEmitter does not have at least one listener registered for the 'error' event, and an 'error' event is emitted, the error is thrown, a stack trace is printed, and the Node.js process exits.

As a best practice, listeners should always be added for the 'error' events.

```js
myEmitter.on('error', err => {
  console.error(err);
});
myEmitter.emit('error', new Error('Gate is broken!'));
```

## Excercise

* create a `emitters.js` file and copy paste this code

* implement this scenario using event emitters :

1.  Sensa must say "For the North" each second, based on a 'north' event

2.  After the first time Sansa says her sentence, John must say "Winter is coming"

3.  After each time Sansa says her sentence, Arya must say "The King in the North" asynchronously based on an event 'arya'
