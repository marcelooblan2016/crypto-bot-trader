"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
function map(response_raw_data, tokenContractList) {
    let tokenContracts = tokenContractList;
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
exports.default = map;
