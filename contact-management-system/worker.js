process.on("message", (msg) => {
  const limit = msg.limit;
  const primeCount = countPrimes(limit);

  process.send({
    limit,
    primeCount,
    workerPID: process.pid // Add process ID to show it's from worker
  });
});

function countPrimes(limit) {
  let count = 0;
  for (let i = 2; i <= limit; i++) {
    if (isPrime(i)) count++;
  }
  return count;
}

function isPrime(num) {
  for (let i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}
