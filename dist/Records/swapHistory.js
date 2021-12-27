"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
const fs = require('fs');
class SwapHistory {
    constructor(options) {
        this.swapHistoryFilePath = './swapHistory.json';
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
    historyData() {
        return JSON.parse(fs.readFileSync(this.swapHistoryFilePath, 'utf8'));
    }
    write(params) {
        let swapHistoryData = this.historyData();
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
        var _a;
        let slug = params.slug;
        let swapHistoryData = this.historyData();
        return (_a = swapHistoryData.filter(history => history.slug == slug)[0]) !== null && _a !== void 0 ? _a : null;
    }
}
exports.default = new SwapHistory;
