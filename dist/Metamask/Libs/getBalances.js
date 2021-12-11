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
function getBalances(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tokenSlug = typeof params.token_slug != 'undefined' ? params.token_slug : null;
            // get all token balance
            if (tokenSlug == null) {
                return yield getBalanceAll(params);
            }
            // get balance bytoken
            else {
                return yield getBalanceByToken(params);
            }
        }
        catch (error) {
            console.log(error);
        }
        return false;
    });
}
function getBalanceByToken(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tokenSlug = params.token_slug;
            let jsonContractPath = '../tokenContracts.json';
            let rawData;
            const fs = require('fs');
            rawData = fs.readFileSync(jsonContractPath);
            let tokenContracts;
            tokenContracts = JSON.parse(rawData);
            tokenContracts = tokenContracts.filter((contract) => contract.slug == tokenSlug);
            let tokenContract = tokenContracts[0];
            const page = params.page;
            const C = params.C;
            let currentUrl = page.url();
            let assetUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                `/home.html#asset/${tokenContract.contract}`
            ].join("");
            yield page.goto(assetUrl);
            yield page.waitForTimeout(1000);
            yield page.waitForSelector(C.elements.get_balances.div_primary_balance, {
                timeout: 15000
            });
            let primaryBalance = yield page.evaluate(function (C) {
                let rawBalance = document.querySelector(C.elements.get_balances.div_primary_balance).innerText;
                let splitted = rawBalance.split("\n");
                return parseFloat(splitted[0]);
            }, C);
            return {
                'balance': primaryBalance,
                'slug': tokenContract.slug,
                'token_raw': null,
            };
        }
        catch (error) {
            console.log(error);
        }
        return false;
    });
}
function getBalanceAll(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = params.page;
            const C = params.C;
            let currentUrl = page.url();
            let homeUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                "/home.html"
            ].join("");
            yield page.goto(homeUrl);
            yield page.waitForTimeout(1000);
            yield page.waitForSelector(C.elements.get_balances.div_token_sell, {
                timeout: 15000
            });
            let divTokens = yield page.evaluate(function (C) {
                let list = [];
                let divTokensRaw = document.querySelectorAll(C.elements.get_balances.div_token_sell);
                for (let i = 0; i < divTokensRaw.length; i++) {
                    list.push(divTokensRaw[i].innerText);
                }
                return list;
            }, C);
            let mappedTokensWithBalance;
            mappedTokensWithBalance = divTokens.map(function (token) {
                let splitted = token.split("\n");
                let mappedTokens;
                mappedTokens = {
                    'balance': parseFloat(splitted[0]),
                    'slug': (splitted[1]).toLocaleLowerCase(),
                    'token_raw': token,
                };
                return mappedTokens;
            });
            return mappedTokensWithBalance;
        }
        catch (error) {
            console.log(error);
        }
        return false;
    });
}
exports.default = getBalances;
