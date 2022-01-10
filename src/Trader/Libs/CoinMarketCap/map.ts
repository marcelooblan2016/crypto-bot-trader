import _ from 'lodash';

function map (response_raw_data: CoinMarketCap.CryptoListFromRawData, tokenContractList: tokenContractInterface[]): CoinMarketCap.Crypto[] {
    let tokenContracts: tokenContractInterface[] = tokenContractList;

    let allowedTokens: Array<string> = tokenContracts.map( (contract) => {
       if (contract.slug == 'wmatic') return 'matic';
       else if (contract.slug == 'weth') return 'eth';
       else if (contract.slug == 'wbtc') return 'btc';
       else return contract.slug
       
    });

    let cryptoCurrencyList = response_raw_data.cryptoCurrencyList;
    let mappedCryptoList: CoinMarketCap.Crypto[] = cryptoCurrencyList.map( function (crypto) {
        let quoteUsd = _.get(crypto, 'quotes', []).filter( (quote: any) => (quote.name).toLowerCase() == 'usd')[0] ?? null;
        
        return ({
            name: _.get(crypto, 'name'),
            symbol: (_.get(crypto, 'symbol')).toLowerCase(),
            current_price: _.get(quoteUsd, 'price'),
            percent_change_1_hour: _.get(quoteUsd, 'percentChange1h'),
            percent_change_1_day: _.get(quoteUsd, 'percentChange24h'),
            percent_change_1_week: _.get(quoteUsd, 'percentChange7d'),
            percent_change_1_month: _.get(quoteUsd, 'percentChange30d'),
            percent_change_2_month: _.get(quoteUsd, 'percentChange60d'),
            percent_change_3_month: _.get(quoteUsd, 'percentChange90d'),
            dominance: _.get(quoteUsd, 'dominance'),
            turnover: _.get(quoteUsd, 'turnover'),
            total_supply: _.get(crypto, 'totalSupply'),
            max_supply: _.get(crypto, 'maxSupply', null),
            circulating_supply: _.get(crypto, 'circulatingSupply'),
            is_active: _.get(crypto, 'isActive'),
            market_pair_count: _.get(crypto, 'marketPairCount'),
            rank: _.get(crypto, 'cmcRank')
        }) as CoinMarketCap.Crypto;
    }).filter( crypto => allowedTokens.includes(crypto.symbol) );

    _.orderBy(mappedCryptoList, 'rank', 'asc');

    return mappedCryptoList;
}

export default map