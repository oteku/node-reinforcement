const p = () =>
  new Promise(resolve =>
    setImmediate(() => {
      sensaSay('For the North');
      resolve();
    })
  ).then(
    () =>
      new Promise(resolve =>
        setImmediate(() => {
          aryaSay('The king in the North');
          resolve();
        })
      )
  );

setInterval(p, 1000);
