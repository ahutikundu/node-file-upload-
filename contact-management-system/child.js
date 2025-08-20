// Listen for messages from the parent process
process.on('message', (message) => {
  console.log('Child received message from parent:', message);

  // Perform a task (e.g., a heavy computation)
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }

  // Send a message back to the parent
  process.send({ result: `Computation complete, result: ${result}` });
});

// Example of a child process sending an initial message
process.send('Child process ready!');