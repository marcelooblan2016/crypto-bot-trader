import ApiCoinMarketCap from 'api.coinmarketcap';
import metaMask from './Metamask/metaMask';

(async function () {
    const newMetaMask = new metaMask();
    // initiate 
    await newMetaMask.build();
    let tokenBalances = await newMetaMask.getBalances('usdc');
    console.log(tokenBalances);
    // let rsp: boolean;
    // rsp = await newMetaMask.swapToken('dai', 'matic', 2);
    // console.log(rsp);

    // await newMetaMask.page!.waitForTimeout(999999);

    // process.exit(0);

    // process.exit(0);
    // let response = await ApiCoinMarketCap.getMarketPrices();

    // let cryptoList = response.cryptoCurrencyList;

    // console.log(JSON.stringify(cryptoList));


})();