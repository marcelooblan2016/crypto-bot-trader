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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
;
function loadTokenContracts(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = params.page;
            const C = params.C;
            let currentUrl;
            currentUrl = page.url();
            let addTokenUrl;
            addTokenUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                "/home.html#add-token"
            ].join("");
            let jsonContractPath;
            jsonContractPath = '../tokenContracts.json';
            let rawData;
            rawData = fs.readFileSync(jsonContractPath);
            let tokenContracts;
            tokenContracts = JSON.parse(rawData);
            for (let index in tokenContracts) {
                let tokenContract;
                yield page.goto(addTokenUrl);
                tokenContract = tokenContracts[index];
                console.log("Adding " + tokenContract['slug'] + " token ...");
                yield page.type(C.elements.add_token.input_contract_address, tokenContract['contract']);
                yield page.type(C.elements.add_token.input_custom_symbol, tokenContract['slug']);
                yield page.type(C.elements.add_token.input_custom_decimals, (tokenContract['decimals']).toString());
                yield page.waitForTimeout(2000);
                const [buttonNext] = yield page.$x(C.elements.add_token.button_next_xpath);
                buttonNext.click();
                yield page.waitForTimeout(1000);
                const [buttonAddTokens] = yield page.$x(C.elements.add_token.button_add_token_xpath);
                buttonAddTokens.click();
                yield page.waitForTimeout(2000);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.default = loadTokenContracts;
