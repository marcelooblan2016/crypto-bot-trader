const {metaMask} = require('../dist/index');

(async function() {
    await metaMask.build();
    await metaMask.getBalances();
    await metaMask.clearPopups();
    // sendTo(walletAddress: string, token: string, amount: number)
    let walletAddress = metaMask.C.methods.send_to;
    let token = 'usdc';
    let amount = 1;
    await metaMask.sendTo(walletAddress, token, amount);
})();