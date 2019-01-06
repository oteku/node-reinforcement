# INTRODUCTION

Before starting the workshop, it's important to be sure you understand javascript Callback mechanism.

### Callstack

JavaScript is a single-threaded language, it creates a single stack.
Considering this snippet :

```JS
const greetAll = (names) => {
  let result = 'hello';
  for(let name of names){
    result += ' ' + name;
  }
  return result;
};
console.log(greetAll(['John','Arya','Sansa']));
```

The output will be : <br/>
`hello John Arya Sansa`

When the code runs, the javascript engine creates a single **callstack** in an execution context and pushes the _greetAll_ function.

```
             Callstack
pop    ┌───────────────────────┐
^      │          }            │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
│      │    return result      │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
│      │concat arguments (loop)│
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
│      │ for (conditional loop)│
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
│      │   Declare variabl     │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
push   ┤      greetAll(){      │
       └───────────────────────┘
```

Once the function returns the result, the local variables are disposed (garbage
collected) and the function pops out from the stack

### Callback

The next snippet simply logs the output after 3 seconds.

```JS
console.log('first');
const logGreet = () =>console.log(greetAll(['John','Arya','Sansa']));
setTimeout(logGreet,3000);
console.log('last');
```

The output will be : <br/>
`first` <br/>
`last` <br/>
`hello John Arya Sansa`

The setTimeout method is a built-in web API, the execution context of the method is the browser web API and not in the developer-defined script's context.

```
             Callstack                      Web API
pop    ┌───────────────────────┐
^      │          }            │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
│      │console.log(           │
│      │greetAll(              │
│      │['John','Arya','Sansa']│
│      │ ));                   │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
│      │After 3s call logGreet │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
│      │ console.log('last');  │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐      ┌───────────────┐
│      │ setTimeout            │      │               │
│      │   (logGreet,3000);    │─────>┤  setTimeout   │
│      └──────────┬────────────┘      └───────────────┘
│      ┌──────────┴────────────┐
│      │   const logGreet      │
│      └──────────┬────────────┘
│      ┌──────────┴────────────┐
push   ┤ console.log('first);  │
       └───────────────────────┘
```

Once the operation is recognized as asynchronous, the
method is called in a different context and the execution of the callstack continues. This is why JavaScript code is said to be non-blocking.

Once it times out in the web API stack (after 6 seconds in our case), the web API
stack pushes the code to the task queue which contains every step that should be executed next in the callstack—the order of priority is based on a First In First Out approach.

An eventloop is responsible for the following:

* Fetching the next task in the event queue
* Assign the task to the callstack in the execution context.

![js_runtime](./assets/js_runtime.png)

**Node.js is a JavaScript runtime environment using Chrome's v8 engine and libuv for async I/O. The main difference in the preceding structure is that the browser's web API is replaced with Node.js API.**

![node_rutime](./assets/node_runtime.jpg)

Node uses the Event-Driven Architecture: it has an Event Loop for orchestration and a Worker Pool for expensive tasks.

The Event Loop executes the JavaScript callbacks registered for events, and is also responsible for fulfilling non-blocking asynchronous requests like network I/O.

Node's Worker Pool is implemented in [libuv](http://docs.libuv.org/en/v1.x/), which exposes a general task submission API. Node uses the Worker Pool to handle "expensive" tasks. This includes I/O for which an operating system does not provide a non-blocking version, as well as particularly CPU-intensive tasks. Applications and modules that use a C++ add-on can submit other tasks to the Worker Pool.

You should make sure you never block the Event Loop. In other words, each of your JavaScript callbacks should complete quickly. This of course also applies to your **await's**, your **Promise.then's**, and so on.

> 📌 Do not confuse the callback with the higher order function. A callback is a function type parameter of an asynchronous HOF. But the synchronous HOF function type parameters are not callbacks.

> 📌 Builtin asyncrhonous functions are mainly related to events, timers, promises, file system, ajax calls and I/O in general.

```js
const foo = cb => {
  console.log('first');
  return cb();
};
// foo is a synchronous high order function
foo(() => console.log('second'));
console.log('third');
```

Output will be :<br/>
`first second third`

```js
const bar = cb => {
  console.log('first');
  // node API equivalent to setTimeout(cb,0) of web API
  return setImmediate(cb);
};
// bar is an asynchronous high order function
bar(() => console.log('second'));
console.log('third');
```

Output will be :<br/>
`first third second`

## Try the workshop

The purpose of this tutorial exercice is to print
`first third second`

create a file :

```sh
touch introduction.js
```

Edit it :

```js
const bar = cb => {
  console.log('first');
  // node API equivalent to setTimeout(cb,0) of web API
  return setImmediate(cb);
};
// bar is an asynchronous high order function
bar(() => console.log('second'));
console.log('forth');
```

While you code is a valide nodejs program you can run it :

```sh
node ./introduction.js
```

or

use `nrw run` command to see only the output

```sh
nrw run ./introduction.js
```

when you think your solution is valid, just use `nrw verify`

```sh
nrw verify ./introduction.js
```

oups there is a mistake ! Edit `introduction.js`again.

```js
const bar = cb => {
  console.log('first');
  // node API equivalent to setTimeout(cb,0) of web API
  return setImmediate(cb);
};
// bar is an asynchronous high order function
bar(() => console.log('second'));
console.log('third');
```

Finaly succeed. Now just run `nrw` to select a new exercice.
