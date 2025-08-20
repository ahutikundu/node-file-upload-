// const fs = require('fs');
// (function Lib(){

//     function first(){
//     console.log('first');
//     setTimeout(()=>console.log('timer2'),0);
//     Process.nextTick(()=>console.trace('tick'))
//     setImmediate(()=>console.log("setImmediate"))
//     second();
// }
// function second(){
//     console.log('second');
//     third();
// }
// function third(){
//     console.log('third');
//    // console.trace();
//    setTimeout(()=>console.log('timer2'),0);
// }

// });


// fs.readFile('./dot.txt', first);

// first();

// // timeout_vs_immediate.js
// setTimeout(() => {
//   console.log('timeout');
// }, 0);

// setImmediate(() => {
//   console.log('immediate');
// });


// timeout_vs_immediate.js
const fs = require('node:fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});

