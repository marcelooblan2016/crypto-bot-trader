import ApiCoinMarketCap from 'api.coinmarketcap';
import metaMask from './Metamask/Metamask';

(async function () {
    const newMetaMask = new metaMask();
    // initiate 
    await newMetaMask.build();
    process.exit(0);

    process.exit(0);
    let response = await ApiCoinMarketCap.getMarketPrices();

    let cryptoList = response.cryptoCurrencyList;

    console.log(JSON.stringify(cryptoList));


})();