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
const trader_1 = __importDefault(require("./Trader/trader"));
const token_1 = __importDefault(require("./Records/token"));
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // // initiate 
        yield metaMask_1.default.build();
        const initiatedTrader = new trader_1.default({ metamask_with_build: metaMask_1.default, token: token_1.default });
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            yield initiatedTrader.analyzeMarket();
        }), 60000);
    });
})();
