
import metaMask from './Metamask/metaMask';
import trader from './Trader/trader';
import token from './Records/token';
import swapHistory from './Records/swapHistory';

(async function () {
    
    // console.log("INIT");
    // swapHistory.write({slug: 'avax', current_price: 5, amount: 20});

    // process.exit(0);
    // // initiate 
    await metaMask.build();
    let rsp: boolean = await metaMask.swapToken('matic', 'bat', 1, 1.16);
    // let rsp: boolean = await metaMask.swapToken('usdc', 'mana', 'all', 2.97);
    console.log(rsp);

    // let tokenBalances = await metaMask.getBalances();
    // console.log(tokenBalances);

    const initiatedTrader = new trader({metamask_with_build: metaMask, token: token});
    await initiatedTrader.analyzeMarket()
    // setInterval(async () => {
    //     await initiatedTrader.analyzeMarket()
    // }, 20000);

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