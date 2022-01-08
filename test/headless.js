const {metaMask, trader, token} = require('../dist/index');
const Xvfb = require('xvfb');

(async function() {
    let xvfb = new Xvfb();
    xvfb.startSync();
    // // initiate 
    await metaMask.build();
    const initiatedTrader = new trader({metamask_with_build: metaMask, token: token});
    
    await initiatedTrader.analyzeMarket()
    setInterval(async () => {
        await initiatedTrader.analyzeMarket()
    }, 300000);
    // every 5 minutes

})();