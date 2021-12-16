"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
const fs = require('fs');
class SwapHistory {
    constructor(options) {
        this.swapHistoryFilePath = '../swapHistory.json';
        if (!fs.existsSync(this.swapHistoryFilePath)) {
            let tokenContracts = token_1.default.tokenContracts().map(function (token) {
                return {
                    slug: token.slug,
                    current_price: 0,
                    amount_acquired: 0,
                    amount_from: 0
                };
            });
            let initialContent = JSON.stringify(tokenContracts);
            fs.writeFileSync(this.swapHistoryFilePath, initialContent);
        }
    }
    write(params) {
        let swapHistoryData = JSON.parse(fs.readFileSync(this.swapHistoryFilePath, 'utf8'));
        for (let index in swapHistoryData) {
            let currentSwap = swapHistoryData[index];
            if (currentSwap.slug == params.slug) {
                swapHistoryData[index].amount_acquired = params.amount_acquired;
                swapHistoryData[index].amount_from = params.amount_from;
                swapHistoryData[index].current_price = params.current_price;
                break;
            }
        }
        fs.writeFileSync(this.swapHistoryFilePath, JSON.stringify(swapHistoryData));
        return true;
    }
    read(params) {
        return true;
    }
}
exports.default = new SwapHistory;
