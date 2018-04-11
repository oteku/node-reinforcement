const john = 'John';
const arya = 'Arya';
const sensa = 'Sensa';
const say = (hero) => (sentence) => console.log(`${hero} says : ${sentence}`);
const johnSay = say(john);
const aryaSay = say(arya);
const sensaSay = say(sensa);

const sensaInterval = setInterval(sensaSay, 1000, 'For the north');
setTimeout(() => {
  johnSay('hello Ladies Stark'); 
  setTimeout(aryaSay, 0, 'thank you for needle');
}, 2000)
setTimeout(() => clearInterval(sensaInterval), 10000);