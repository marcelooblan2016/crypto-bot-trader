import _ from 'lodash';
import ApiCoinMarketCap from 'api.coinmarketcap';

interface AnalyzeParameters {
    metamask_with_build: MetamaskInterface
}

class Trader {
    protected stableCoin: tokenContractInterface;
    protected tokenContractList: tokenContractInterface[];
    
    constructor(options? : any) {
        this.tokenContractList = this.tokenContracts();
        this.stableCoin = this.tokenContractList.filter( contract => contract.stablecoin == true)[0] ?? null;
    }
    
    private tokenContracts (): tokenContractInterface[] {
        let jsonContractPath: string = '../tokenContracts.json';

        const fs = require('fs');
        let rawData: string = fs.readFileSync(jsonContractPath);

        return (JSON.parse(rawData)) as tokenContractInterface[];
    }

    private map (response_raw_data: CoinMarketCap.CryptoListFromRawData): CoinMarketCap.Crypto[] {
        let tokenContracts: tokenContractInterface[] = this.tokenContractList;
        let allowedTokens: Array<string> = tokenContracts.map( contract => contract.slug );

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

    async analyzeMarket (params: AnalyzeParameters) {
        const metaMaskWithBuild = params.metamask_with_build;
        // console.log(this.stableCoin);
        // let responseData = await ApiCoinMarketCap.getMarketPrices(1, 150, {tagSlugs: null});

        // let mappedData = this.map((responseData) as CoinMarketCap.CryptoListFromRawData);

        // todo
        /**
         * Check if usdc (stable coin is empty)
         * ** If empty, it is ready to buy -> search for good token to buy per condition
         * ** else check token with balance, watch the token if it is good for sell per condition with a consideration of cutloss
         */
        // ready to buy
        // ready to sell
    }
}

export default new Trader;