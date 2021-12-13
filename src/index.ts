
import metaMask from './Metamask/metaMask';
import trader from './Trader/trader';
(async function () {
    // // initiate 
    // await metaMask.build();
    // let response = await trader.analyzeMarket({metamask_with_build: metaMask});
    console.log("METAMASK BUILD");

    setInterval(async () => {
        await trader.analyzeMarket({metamask_with_build: metaMask})
    }, 5000);
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