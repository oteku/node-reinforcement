# Timers

[Timers on Node.js API](https://nodejs.org/dist/latest-v8.x/docs/api/timers.html)

## Focus on Event Loop

The following diagram shows a simplified overview of the event loop's order of operations.

```
   ┌───────────────────────┐
┌─>│        timers         │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     I/O callbacks     │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
│  │     idle, prepare     │
│  └──────────┬────────────┘      ┌───────────────┐
│  ┌──────────┴────────────┐      │   incoming:   │
│  │         poll          │<─────┤  connections, │
│  └──────────┬────────────┘      │   data, etc.  │
│  ┌──────────┴────────────┐      └───────────────┘
│  │        check          │
│  └──────────┬────────────┘
│  ┌──────────┴────────────┐
└──┤    close callbacks    │
   └───────────────────────┘
```

_note: each box will be referred to as a "phase" of the event loop._

## Phases Overview

* **timers**: this phase executes callbacks scheduled by setTimeout() and setInterval().
* **I/O callbacks**: executes almost all callbacks with the exception of close callbacks, the ones scheduled by timers, and setImmediate().
* **idle, prepare**: only used internally.
* **poll**: retrieve new I/O events; node will block here when appropriate.
* **check**: setImmediate() callbacks are invoked here.
* **close callbacks**: e.g. socket.on('close', ...).

## Timers

Timers are simply a promise that Node will do its best to execute the callback as close as possible to the requested time. **The only guarantee is that it will not execute earlier**.

```js
setTimeout(foo, 100);
setTimeout(bar, 101);
```

There is **no guarantee** that callback `foo` will in fact execute before `bar`.

Node.js provides 3 kinds of timers :

* setInterval :: (Function, number) => Timeout

```js
setInterval(() => console.log('log at least each 3 seconds'), 3000);
```

_setInteval_ timer aims to schedule reccurent tasks that should be manage by a node application.
Schelduled tasks that need to be at an exact interval of time must be manage outside a node program.

* setImmediate :: (Function) => Immediate

```js
setImmediate(() => console.log('log at the next loop'));
```

_setImmediate_ timer aims to plan an asynchronous task "just after the end of the current callstack". In fact, it will be run in the next event loop, after the _close callback_ phase and befor the _poll_ phase. Sometime usefull if you need to shorcut callbacks or other timers (often to unref timers). In other cases using EventEmitter or Promises is a better solution to plan next async task.

* seTimeout :: (Function, number, ?any) => Timeout

```js
setTimeout(() => console.log('log in at least 3 seconds'), 3000);
```

_setTimeout_ timer aims to plan an asynchronous task "in at least" a delta time. There is few use case in node.js where using setTimeout is a good solution. You should avoid using this timer and always prefer events which are more reliable.

## Unref timers

## Excercise

```js
const john = 'John';
const arya = 'Arya';
const sensa = 'Sensa';
const say = hero => sentence => console.log(`${hero} says : ${sentence}`);
const johnSay = say(john); // may be used this way setTimeout(johnSay, 1000, 'hello');
const aryaSay = say(arya);
const sensaSay = say(sensa);
```

* create a `timer.js` file and copy paste this code

* implemente this scenario :

1.  Sensa must say "For the north" each second, during 10 seconds

2.  John must say "Hello Ladies Stark" 2 seconds after the program starts

3.  Ayra must say "Thank you for needle" immediately after John spoke but before Sensa speak again. Her speech must be executed in a different callstack that john speech
