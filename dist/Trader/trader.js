"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
class Trader {
    constructor(options) {
        var _a;
        this.tokenContractList = this.tokenContracts();
        this.stableCoin = (_a = this.tokenContractList.filter(contract => contract.stablecoin == true)[0]) !== null && _a !== void 0 ? _a : null;
    }
    tokenContracts() {
        let jsonContractPath = '../tokenContracts.json';
        const fs = require('fs');
        let rawData = fs.readFileSync(jsonContractPath);
        return (JSON.parse(rawData));
    }
    map(response_raw_data) {
        let tokenContracts = this.tokenContractList;
        let allowedTokens = tokenContracts.map(contract => contract.slug);
        let cryptoCurrencyList = response_raw_data.cryptoCurrencyList;
        let mappedCryptoList = cryptoCurrencyList.map(function (crypto) {
            var _a;
            let quoteUsd = (_a = lodash_1.default.get(crypto, 'quotes', []).filter((quote) => (quote.name).toLowerCase() == 'usd')[0]) !== null && _a !== void 0 ? _a : null;
            return ({
                name: lodash_1.default.get(crypto, 'name'),
                symbol: (lodash_1.default.get(crypto, 'symbol')).toLowerCase(),
                current_price: lodash_1.default.get(quoteUsd, 'price'),
                percent_change_1_hour: lodash_1.default.get(quoteUsd, 'percentChange1h'),
                percent_change_1_day: lodash_1.default.get(quoteUsd, 'percentChange24h'),
                percent_change_1_week: lodash_1.default.get(quoteUsd, 'percentChange7d'),
                percent_change_1_month: lodash_1.default.get(quoteUsd, 'percentChange30d'),
                percent_change_2_month: lodash_1.default.get(quoteUsd, 'percentChange60d'),
                percent_change_3_month: lodash_1.default.get(quoteUsd, 'percentChange90d'),
                dominance: lodash_1.default.get(quoteUsd, 'dominance'),
                turnover: lodash_1.default.get(quoteUsd, 'turnover'),
                total_supply: lodash_1.default.get(crypto, 'totalSupply'),
                max_supply: lodash_1.default.get(crypto, 'maxSupply', null),
                circulating_supply: lodash_1.default.get(crypto, 'circulatingSupply'),
                is_active: lodash_1.default.get(crypto, 'isActive'),
                market_pair_count: lodash_1.default.get(crypto, 'marketPairCount'),
                rank: lodash_1.default.get(crypto, 'cmcRank')
            });
        }).filter(crypto => allowedTokens.includes(crypto.symbol));
        lodash_1.default.orderBy(mappedCryptoList, 'rank', 'asc');
        return mappedCryptoList;
    }
    analyzeMarket(params) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.default = new Trader;
