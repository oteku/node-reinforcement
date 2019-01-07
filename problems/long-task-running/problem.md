# Long task running

How to deal with long task running ?

A ridicoulous long task :

```js
const heavyDo = () => {
  let count = 0;
  for (let i = 0; i < 1e8; i++) {
    if (
      Math.round(
        Math.log(Math.sqrt(Math.abs(Math.round(Math.random() * 1e10))))
      ) === 1
    )
      count++;
  }
  return count;
};

setInterval(() => console.log('I am blocked'), 1000);
console.log(heavyDo()); // take almost 10 seconds
```

## Cut it down ?

Force callback don't really help !

```js
const notSoHeavyDo = times => {
  let count = 0;
  for (let i = 0; i < times; i++) {
    if (
      Math.round(
        Math.log(Math.sqrt(Math.abs(Math.round(Math.random() * 1e10))))
      ) === 1
    )
      count++;
  }
  return count;
};

const heavyDo = callback => {
  let total = 1e8,
    cuts = 100,
    counts = 0,
    remains = cuts;
  for (let i = 0; i < cuts; i++) {
    setImmediate(() => {
      counts = counts + notSoHeavyDo(total / cuts);
    });
    remains--;
    if (!remains) setImmediate(callback, counts);
  }
};

setInterval(() => console.log('I am not blocked'), 1000);
heavyDo(counts => console.log(counts));
```

Solutions using **setImmediate** or **process.nextTick** unlock the current callstack but lock the event loop !

## Child process

Node provides a way to manage process from a master process. This is _child processes_.

```js
// assuming you have copy the last exemple, after removing the setInterval in a file heavy.js
const cp = require('child_process');

setInterval(() => console.log('I am not blocked'), 1000);

const subprocess = cp.fork('heavy.js');
```

your outupt should be like :

```
I am not blocked
I am not blocked
I am not blocked
I am not blocked
0
I am not blocked
I am not blocked
...
```

> 📌 A solution is to isolate long task running in child processes

## Exercice

Find a solution to make the heavyDo really asynchronous without a child process and stop after 10 secondes.
