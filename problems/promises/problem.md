# Promises

While async I/O have great performances impacts, you may need to do some synchronous tasks with their results or garantee a that next task start after.

Node.js provides callbacks or events on each async API, both may be see as continuation of async tasks.

```js
http
  .get('http://nodejs.org/dist/index.json', res => {
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', chunk => {
      rawData += chunk;
    });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        console.log(parsedData);
      } catch (e) {
        console.error(e.message);
      }
    });
  })
  .on('error', e => {
    console.error(`Got error: ${e.message}`);
  });
```

## Tradeoffs

1.  Callbacks hell !

Asynchronous JavaScript that uses callbacks, is hard to get right intuitively.

What this code do ?

```js
fs.readdir(source, function(err, files) {
  if (err) {
    console.log('Error finding files: ' + err);
  } else {
    files.forEach(function(filename, fileIndex) {
      console.log(filename);
      gm(source + filename).size(function(err, values) {
        if (err) {
          console.log('Error identifying file size: ' + err);
        } else {
          console.log(filename + ' : ' + values);
          aspect = values.width / values.height;
          widths.forEach(
            function(width, widthIndex) {
              height = Math.round(width / aspect);
              console.log(
                'resizing ' + filename + 'to ' + height + 'x' + height
              );
              this.resize(width, height).write(
                dest + 'w' + width + '_' + filename,
                function(err) {
                  if (err) console.log('Error writing file: ' + err);
                }
              );
            }.bind(this)
          );
        }
      });
    });
  }
});
```

2.  GOTO pitfall

Events are great for things that can happen multiple times on the same object. Managing a workflow with them may be see as consecutive goto and quickly gives a headaches

## Promise API

A Promise is in one of these states:

* **pending**: initial state, neither fulfilled nor rejected.
* **fulfilled**: meaning that the operation completed successfully.
* **rejected**: meaning that the operation failed.

```js
Promise.resolve(johnSay('hello')) //create a fullfilled promise
.then(() => new Promise((resolve, reject) => {
    //do somethin async here
    reject('error here')
}), err => console.error) //will catch promise rejection inside this `then` function, do not continue the promise chain
.then(() => new Promise((resolve, reject) => {
    resolve('Thank you for needle')
})
.catch( err => console.error) //catch all uncatched rejection
```

A pending promise can either be fulfilled with a value, or rejected with a reason (error).

> 📌 then() takes two arguments, one for success, one for failure (or fulfill and reject, in promises-speak).

> 📌 Avoid using async / await syntax. It's just syntaxical sugar for promise that break undestranding of chaining.

> 📌 A promise should always have a catch()

Impact on execution flow

```js
p = new Promise((resolve, reject) => {
  setImmediate(() => {
    johnSay('hello');
    resolve('hello');
  });
});
console.log('before promise is fired');
p
  .then(value => {
    console.log(p);
    return new Promise(resolve =>
      setImmediate(() => {
        aryaSay(value);
        resolve();
      })
    );
  })
  .then(() => console.log('end of promise chain'));
console.log('after promise is fired');
console.log(p);
```

> 📌 Always return a Promise Object inside a then

Don't block the loop

```js
p = new Promise((resolve, reject) => {
  setImmediate(() => {
    johnSay('hello');
    resolve('hello');
  });
});

console.log('before promise is fired');
p
  .then(value => {
    console.log(p);
    return Promise.all([
      new Promise(resolve =>
        setImmediate(() => {
          aryaSay(value);
          resolve();
        })
      ),
      new Promise(resolve =>
        setImmediate(() => {
          sensaSay(value);
          resolve();
        })
      ),
    ]);
  })
  .then(() => console.log('end of promise chain'));
console.log('after promise is fired');
console.log(p);
```

> 📌 Use Promise.all to fire promise not linked together when you want to someting afer all is fullfiled

## Excercise

* create a `promises.js` file and copy paste this code

* implement this scenario using promises :

1.  Sensa must say "For the North" each second

2.  After the first time Sansa says her sentence, John must say "Winter is coming"

3.  After each time Sansa says her sentence, Arya must say "The King in the North"

---

source :

[promise/A+](https://promisesaplus.com/)
