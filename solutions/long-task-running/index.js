const notSoHeavyDo = times => {
  let count = 0;
  for (let i = 0; i < times; i++) {
    if (
      Math.round(
        Math.log(Math.sqrt(Math.abs(Math.round(Math.random() * 1000))))
      ) === 1
    )
      count++;
  }
  return count;
};

var heavyJobs = {
  counts: 0,
  queue: [],
  _callback: null,

  add: function(task) {
    this.queue.push(task);
  },
  next: function() {
    const self = this;
    const task = self.queue.shift();
    if (!task) return;

    setImmediate(() => {
      self.counts = self.counts + task();
      self.queue.length === 0 ? self._callback(self.counts) : self.next();
    });
  },
  do: function(cb) {
    this._callback = cb;
    this.next();
  },
};

let total = 1e8,
  cuts = 100;
for (let i = 0; i < cuts; i++) {
  heavyJobs.add(() => notSoHeavyDo(total / cuts));
}

setInterval(() => console.log('I am not blocked'), 1000);

heavyJobs.do(counts => console.log(counts));
