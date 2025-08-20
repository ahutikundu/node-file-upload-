process.on('message', num => {
    num = parseInt(num);
    let isPrime = true;

    if (num < 2) isPrime = false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime) {
        process.send(`${num} is prime`);
    } else {
        process.send(`${num} is NOT prime`);
    }
});
