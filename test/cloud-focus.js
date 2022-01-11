const {metaMask, trader, token} = require('../dist/index');
const { exec } = require("child_process");

(async function() {
    let args = process.argv.slice(2);
    let validArguments = {};
    if (args.length >= 1) {
        args = args.forEach( function (argument) {
            let splittedArgument = argument.replace("--", "").split("=");
            validArguments[splittedArgument[0]] = (splittedArgument[1] ?? null);
        });
    }
    
    let token = validArguments['focus'] ?? null;
    if (token == null) {
        console.log("token is a requirement");
        process.exit(0);
    }

    await metaMask.initializeSecurity({pwd: null, is_setup: true});
    // exec(`node main.js --pwd=1`, (error, stdout, stderr) => {});
   exec(`forever start headless.js --pwd=1 --focus=${token}`, (error, stdout, stderr) => {});

})();