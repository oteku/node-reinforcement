const bar = cb => {
  console.log('first');
  // node API equivalent to setTimeout(cb,0) of web API
  return setImmediate(cb);
};
// bar is an asynchronous high order function
bar(() => console.log('second'));
console.log('third');
