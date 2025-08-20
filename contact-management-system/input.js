const redline = require("readline");
const rl= redline.createInterface({
 input:process.stdin,
 output: process.stdout
});

rl.question("please enter your name: ", (name)=>{
    console.log("you entered:" +name);
    rl.close();

})

rl.on('close', () =>{
    console.log("Interface closed");
    process.exit(0);
})

console.log(process.pid); // process ID
console.log(process.cwd()); // current working directory
