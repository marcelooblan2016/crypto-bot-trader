
import metaMask from './Metamask/metaMask';
import trader from './Trader/trader';
import token from './Records/token';

(async function () {

    // // initiate 
    await metaMask.build();

    const initiatedTrader = new trader({metamask_with_build: metaMask, token: token});

    setInterval(async () => {
        await initiatedTrader.analyzeMarket()
    }, 20000);

    // let tokenBalances = await metaMask.getBalances();
    // console.log(tokenBalances);
    // console.log(response);

    // process.exit(0);
    // let rsp: boolean;
    // let rsp: boolean = await metaMsk.swapToken('matic', 'link', 1);
    // console.log(rsp);

    // await newMetaMask.page!.waitForTimeout(999999);

    // process.exit(0);

    // process.exit(0);
    // let response = await ApiCoinMarketCap.getMarketPrices();

    // let cryptoList = response.cryptoCurrencyList;

    // console.log(JSON.stringify(cryptoList));


})();