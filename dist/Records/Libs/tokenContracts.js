"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenContracts_1 = __importDefault(require("../Migrations/tokenContracts"));
function tokenContracts() {
    let fileName = 'tokenContracts.json';
    let jsonContractPath = `./${fileName}`;
    const fs = require('fs');
    if (!fs.existsSync(jsonContractPath)) {
        fs.appendFileSync(jsonContractPath, JSON.stringify(tokenContracts_1.default));
    }
    let rawData = fs.readFileSync(jsonContractPath);
    return (JSON.parse(rawData));
}
exports.default = tokenContracts;
