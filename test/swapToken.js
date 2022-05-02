const {metaMask} = require('../dist/index');

(async function() {
    await metaMask.build();
    await metaMask.getBalances();
    await metaMask.clearPopups();

    let description = [
        "Cut Loss: ",
        "5%",
        "Earned: 5 usd",
    ].join(" ");
    
    await metaMask.swapToken("usdc", "matic", 1, 0, description);
})();