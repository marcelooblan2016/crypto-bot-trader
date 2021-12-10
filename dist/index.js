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
const metaMask_1 = __importDefault(require("./Metamask/metaMask"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        const newMetaMask = new metaMask_1.default();
        // initiate 
        yield newMetaMask.build();
        let tokenBalances = yield newMetaMask.getBalances();
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
    });
})();
