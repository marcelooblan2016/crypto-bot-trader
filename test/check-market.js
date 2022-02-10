const ApiCoinMarketCap = require('api.coinmarketcap');
const fs = require('fs');

( async function () {
    let response = await ApiCoinMarketCap.getMarketPrices(1, 150, {tagSlugs: null});

    let contractList = (JSON.parse(fs.readFileSync('./tokenContracts.json', 'utf8')))
    .map( (contract) => {
        if (contract.slug == 'weth') return 'eth';
        else if (contract.slug == 'wbtc') return 'btc';
        else if (contract.slug == 'wmatic') return 'matic';

        return contract.slug;
    });

    let cryptoMarkePerContractList = (response.cryptoCurrencyList)
    .filter( (crypto) => contractList.includes( (crypto.symbol).toLowerCase() ))
    .map( (crypto) => {
        delete crypto['tags'];
        delete crypto['platform'];

        if (typeof crypto['auditInfoList'] != 'undefined') delete crypto['auditInfoList'];
        
        let currentQuote = (crypto['quotes']).filter( (quote) => (quote.name).toLowerCase() == 'usd' )[0] ?? null;
        delete crypto['quotes'];
        
        crypto['currentQoute'] = {
            price: currentQuote['price'],
            percentChange1h: currentQuote['percentChange1h'],
            percentChange24h: currentQuote['percentChange24h'],
            percentChange7d: currentQuote['percentChange7d'],
            percentChange30d: currentQuote['percentChange30d'],
        };

        return crypto;
    });

    console.log(cryptoMarkePerContractList);
})();