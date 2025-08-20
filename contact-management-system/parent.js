const { fork } = require('child_process');

const child = fork('./child.js'); // Forks a new Node.js process running 'child.js'

// Listen for messages from the child process
child.on('message', (message) => {
  console.log('Parent received message from child:', message);
});

// Send a message to the child process after a delay
setTimeout(() => {
  child.send({ data: 'Hello from parent!' });
}, 1000);

// Handle child process exit
child.on('exit', (code, signal) => {
  console.log(`Child process exited with code ${code} and signal ${signal}`);
});