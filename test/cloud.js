const {metaMask, trader, token} = require('../dist/index');
const { exec } = require("child_process");

(async function() {
    await metaMask.initializeSecurity({pwd: null, is_setup: true});
    exec(`node main.js --pwd=1`, (error, stdout, stderr) => {});
   // exec(`forever start headless.js --pwd=1`, (error, stdout, stderr) => {});

})();