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
            const page = params.page;
            const C = params.C;
            let currentUrl;
            currentUrl = page.url();
            let homeUrl;
            homeUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                "/home.html"
            ].join("");
            yield page.goto(homeUrl);
            yield page.waitForTimeout(1000);
            yield page.waitForSelector('.list-item.asset-list-item.token-cell', {
                timeout: 15000
            });
            let divTokens = yield page.evaluate(function () {
                let list = [];
                let divTokensRaw = document.querySelectorAll('.list-item.asset-list-item.token-cell');
                let i;
                for (i = 0; i < divTokensRaw.length; i++) {
                    list.push(divTokensRaw[i].innerText);
                }
                return list;
            });
            let mappedTokensWithBalance = divTokens.map(function (token) {
                let splitted = token.split("\n");
                return {
                    'balance': parseFloat(splitted[0]),
                    'slug': (splitted[1]).toLocaleLowerCase(),
                    'token_raw': token,
                };
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
