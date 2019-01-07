const john = 'John';
const arya = 'Arya';
const sensa = 'Sensa';
const say = hero => sentence => Promise.resolve(`${hero} says : ${sentence}`);
const johnSay = say(john);
const aryaSay = say(arya);
const sensaSay = say(sensa);

const sensaThenArya = () =>
  sensaSay('For the North')
    .then(result => {
      console.log(result);
      return aryaSay('The king in the North');
    })
    .then(console.log);

sensaThenArya()
  .then(() => johnSay('Winter is coming'))
  .then(result => {
    console.log(result);
    return new Promise((res, rej) => {
      timer = setInterval(sensaThenArya, 1000);
      setTimeout(() => {
        clearInterval(timer);
        res();
      }, 10000);
    });
  })
  .catch(err => console.error(err));
