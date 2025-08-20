const { fork } = require('child_process');

const numbers = process.argv.slice(2); // Get numbers from CLI args

numbers.forEach((num, index) => {
    const child = fork('primeChecker.js');

    child.on('message', msg => {
        console.log(`Child ${index + 1} says: ${msg}`);
    });

    child.send(num); // Send number to child
});
