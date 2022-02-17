const {metaMask} = require('../dist/index');

(async function() {
    await metaMask.build();
    let description = [
        "Cut Loss: ",
        "5%",
        "Earned: 5 usd",
    ].join(" ");
    
    await metaMask.swapToken("matic", "wmatic", 1, 0, description);
})();