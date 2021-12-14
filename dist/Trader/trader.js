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
        this.metaMaskWithBuild = contructorParams.metamask_with_build;
        this.token = contructorParams.token;
        this.tokenContractList = this.token.tokenContracts();
        this.stableCoin = (_a = this.tokenContractList.filter(contract => contract.stablecoin == true)[0]) !== null && _a !== void 0 ? _a : null;
    }
    map(response_raw_data) {
        let tokenContracts = this.tokenContractList;
        return lib_1.default.map(response_raw_data, tokenContracts);
    }
    analyzeMarket() {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log(this.stableCoin);
            let responseData = yield api_coinmarketcap_1.default.getMarketPrices(1, 150, { tagSlugs: null });
            let mappedData = this.map((responseData));
            console.log(mappedData);
            // todo
            /**
             * Check if usdc (stable coin is empty)
             * ** If empty, it is ready to buy -> search for good token to buy per condition
             * ** else check token with balance, watch the token if it is good for sell per condition with a consideration of cutloss
             * ******* * Check if cutloss reached the max, or if profit to sell
             */
            // is to Buy
            // is to Sell
        });
    }
}
exports.default = Trader;
