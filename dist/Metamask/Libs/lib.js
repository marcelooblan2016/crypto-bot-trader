"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getBalances_1 = __importDefault(require("./getBalances"));
const loadTokenContracts_1 = __importDefault(require("./loadTokenContracts"));
const swapToken_1 = __importDefault(require("./swapToken"));
const switchNetwork_1 = __importDefault(require("./switchNetwork"));
const addNewNetwork_1 = __importDefault(require("./addNewNetwork"));
const sendTo_1 = __importDefault(require("./sendTo"));
exports.default = {
    getBalances: getBalances_1.default,
    loadTokenContracts: loadTokenContracts_1.default,
    swapToken: swapToken_1.default,
    switchNetwork: switchNetwork_1.default,
    addNewNetwork: addNewNetwork_1.default,
    sendTo: sendTo_1.default
};
