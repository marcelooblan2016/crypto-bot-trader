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
const lib_1 = __importDefault(require("./Libs/lib"));
const api_coinmarketcap_1 = __importDefault(require("api.coinmarketcap"));
class Trader {
    constructor(contructorParams) {
        var _a;
        this.exceptionSlugs = ['matic', 'usdc'];
        this.metaMaskWithBuild = contructorParams.metamask_with_build;
        this.token = contructorParams.token;
        this.tokenContractList = this.token.tokenContracts();
        this.stableCoin = (_a = this.tokenContractList.filter(contract => contract.stablecoin == true)[0]) !== null && _a !== void 0 ? _a : null;
    }
    map(response_raw_data) {
        let tokenContracts = this.tokenContractList;
        return lib_1.default.map(response_raw_data, tokenContracts);
    }
    /*
     * analyzeMarket : Check wallet balance, decide if it will buy/sell base on the market
     * @params Any
     * @return boolean
     */
    analyzeMarket(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // check stable coin balancebalance
                let tokenBalances = yield this.metaMaskWithBuild.getBalances();
                if (typeof tokenBalances == 'boolean') {
                    return false;
                }
                tokenBalances = (tokenBalances);
                let stableCoinBalance = (_a = tokenBalances.filter((token) => token.slug == this.stableCoin.slug).map(token => Number(token.balance))[0]) !== null && _a !== void 0 ? _a : null;
                // check if will sell or buy
                let sellMode = false;
                if (stableCoinBalance <= 0) {
                    sellMode = true;
                }
                let responseData = yield api_coinmarketcap_1.default.getMarketPrices(1, 150, { tagSlugs: null });
                let mappedMarketData = this.map((responseData));
                // console.log(mappedMarketData);
                // console.log(tokenBalances);
                if (sellMode == true) {
                    yield this.sellMode({ mappedMarketData: mappedMarketData, tokenBalances: tokenBalances });
                }
                else {
                    yield this.buyMode();
                }
                // todo
                /**
                 * Check if usdc (stable coin is empty)
                 * ** If empty, it is ready to buy -> search for good token to buy per condition
                 * ** else check token with balance, watch the token if it is good for sell per condition with a consideration of cutloss
                 * ******* * Check if cutloss reached the max, or if profit to sell
                 */
                return true;
            }
            catch (error) { }
            return false;
        });
    }
    sellMode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let mappedMarketData = params.mappedMarketData;
            let exceptionSlugs = this.exceptionSlugs;
            // get token with balance except matic
            let tokenWithBalanceAndMarketData = (params.tokenBalances).filter(function (token) {
                if (!exceptionSlugs.includes(token.slug) && token.balance > 0) {
                    return true;
                }
                return false;
            }).map(function (token) {
                var _a;
                let tokenMarket = (_a = mappedMarketData.filter((tokenMarket) => tokenMarket.symbol == token.slug)[0]) !== null && _a !== void 0 ? _a : {};
                return Object.assign(Object.assign({}, token), tokenMarket);
            });
            console.log(tokenWithBalanceAndMarketData);
            // todo  / check from swapHistory compare -> sell if profit or cutloss
            process.exit(0);
        });
    }
    buyMode() {
        return __awaiter(this, void 0, void 0, function* () {
            // todo
        });
    }
}
exports.default = Trader;
