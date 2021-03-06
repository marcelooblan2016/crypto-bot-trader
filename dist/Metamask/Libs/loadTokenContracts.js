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
const logger_1 = __importDefault(require("../../Records/logger"));
function loadTokenContracts(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = params.page;
        const C = params.C;
        const tokenContracts = params.tokenContracts;
        try {
            let currentUrl = page.url();
            let addTokenUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                "/home.html#import-token"
            ].join("");
            for (let index in tokenContracts) {
                yield page.goto(addTokenUrl, { waitUntil: 'networkidle0' });
                yield page.waitForTimeout(1000);
                let isSearchAndCustomToken = yield page.evaluate((options) => {
                    const C = options['config'];
                    return document.querySelectorAll(C.elements.add_token.button_search_and_add_token).length >= 2 ? true : false;
                }, { 'config': C });
                if (isSearchAndCustomToken === true) {
                    yield page.waitForXPath(C.elements.add_token.button_custom_token_xpath);
                    const [buttonCustomAddToken] = yield page.$x(C.elements.add_token.button_custom_token_xpath);
                    yield buttonCustomAddToken.click();
                }
                let tokenContract = tokenContracts[index];
                logger_1.default.write({ content: "Adding " + tokenContract['slug'] + " token ..." });
                yield page.waitForSelector(C.elements.add_token.input_contract_address);
                yield page.focus(C.elements.add_token.input_contract_address);
                yield page.type(C.elements.add_token.input_contract_address, tokenContract['contract']);
                yield page.waitForTimeout(2000);
                // check if enabled
                yield page.waitForSelector(C.elements.add_token.input_custom_symbol);
                let isDisabledInputSymbol = yield page.evaluate((options) => {
                    const C = options['config'];
                    return document.querySelectorAll(`${C.elements.add_token.input_custom_symbol}:disabled`).length >= 1 ? true : false;
                }, { 'config': C });
                if (isDisabledInputSymbol === false) {
                    yield page.focus(C.elements.add_token.input_custom_symbol);
                    yield page.type(C.elements.add_token.input_custom_symbol, tokenContract['slug']);
                    yield page.waitForTimeout(1000);
                }
                // check if enabled
                yield page.waitForSelector(C.elements.add_token.input_custom_decimals);
                let isDisabledInputDecimals = yield page.evaluate((options) => {
                    const C = options['config'];
                    return document.querySelectorAll(`${C.elements.add_token.input_custom_decimals}:disabled`).length >= 1 ? true : false;
                }, { 'config': C });
                if (isDisabledInputDecimals === false) {
                    yield page.focus(C.elements.add_token.input_custom_decimals);
                    yield page.type(C.elements.add_token.input_custom_decimals, (tokenContract['decimals']).toString());
                }
                yield page.waitForXPath(C.elements.add_token.button_add_token_xpath + "[not(@disabled)]");
                const [buttonAddTokens] = yield page.$x(C.elements.add_token.button_add_token_xpath);
                yield buttonAddTokens.click();
                yield page.waitForXPath(C.elements.add_token.button_import_tokens_xpath + "[not(@disabled)]");
                const [buttonImportTokens] = yield page.$x(C.elements.add_token.button_import_tokens_xpath);
                yield buttonImportTokens.click();
                yield page.waitForNavigation();
            }
        }
        catch (error) {
            logger_1.default.write({ content: JSON.stringify(error) });
        }
    });
}
exports.default = loadTokenContracts;
