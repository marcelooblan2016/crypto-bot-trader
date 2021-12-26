
import metaMask from './Metamask/metaMask';
import trader from './Trader/trader';
import token from './Records/token';

(async function () {
    // // initiate 
    await metaMask.build();

    const initiatedTrader = new trader({metamask_with_build: metaMask, token: token});

    setInterval(async () => {
        await initiatedTrader.analyzeMarket()
    }, 60000);

})();