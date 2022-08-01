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
    
    await metaMask.swapToken("matic", "usdc", 3, 0, description);
})();