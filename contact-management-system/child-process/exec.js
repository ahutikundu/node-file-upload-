const { exec } = require('child_process');
exec('ls -l', (err, stdout, stderr) => {

    console.log("STDOUT: ", stdout);
    console.log("ERROR: ", err);
    console.log("STDERR: ", stderr);
});
