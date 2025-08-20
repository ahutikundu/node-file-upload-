const express = require("express");
const { fork } = require("child_process");

const app = express();

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// With child process
app.get("/primes", (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100000;
  const startTime = Date.now();

  const child = fork("./worker.js");

  const timeout = setTimeout(() => {
    child.kill();
    res.status(504).json({ error: "Calculation timed out", from: "parent" });
  }, 10000);

  child.send({ limit });

  child.on("message", (msg) => {
    clearTimeout(timeout);
    // Add "from": "child" in the worker's data
    res.json({
      ...msg, // all data from child
      tookMs: Date.now() - startTime,
     // from: "child"
    });
  });

  child.on("error", (err) => {
    clearTimeout(timeout);
    res.status(500).json({ error: err.message, from: "parent" });
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      clearTimeout(timeout);
      res.status(500).json({ error: `Worker exited with code ${code}`, from: "parent" });
    }
  });
});

// No child process (blocking)
app.get("/primes/nochild", (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 100000;
  const startTime = Date.now();
  const primeCount = countPrimes(limit);
  res.json({
    limit,
    primeCount,
    tookMs: Date.now() - startTime,
  //  from: "parent"
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

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
