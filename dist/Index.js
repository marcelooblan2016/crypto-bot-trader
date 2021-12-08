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
const api_coinmarketcap_1 = __importDefault(require("api.coinmarketcap"));
const Metamask_1 = __importDefault(require("./Metamask/Metamask"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const newMetaMask = new Metamask_1.default();
        // initiate 
        yield newMetaMask.build();
        process.exit(0);
        process.exit(0);
        let response = yield api_coinmarketcap_1.default.getMarketPrices();
        let cryptoList = response.cryptoCurrencyList;
        console.log(JSON.stringify(cryptoList));
    });
})();
