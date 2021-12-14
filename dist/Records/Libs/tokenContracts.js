"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function tokenContracts() {
    let jsonContractPath = '../tokenContracts.json';
    const fs = require('fs');
    let rawData = fs.readFileSync(jsonContractPath);
    return (JSON.parse(rawData));
}
exports.default = tokenContracts;
