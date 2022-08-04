const {metaMask} = require('../dist/index');
const _ = require('lodash');

(async function() {
    await metaMask.build();
    await metaMask.getBalances();
    await metaMask.clearPopups();
    let walletAddress = _.get(metaMask, 'C.methods.send_to');
    let token = 'usdc';
    let amount = 1;
    await metaMask.sendTo(walletAddress, token, amount);
})();