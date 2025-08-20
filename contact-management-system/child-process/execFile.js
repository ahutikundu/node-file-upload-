const { execFile } = require('child_process');
execFile('node', ['-v'], (err, stdout) => {
console.log("er1" ,err);
  console.log("out",stdout);
});
