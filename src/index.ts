
import metaMask from './Metamask/metaMask';
import trader from './Trader/trader';
(async function () {
    let response = await trader.analyzeMarket();
    console.log(response);
    
    // // initiate 
    // await metaMask.build();
    // let tokenBalances = await metaMask.getBalances('matic');
    // console.log(tokenBalances);
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