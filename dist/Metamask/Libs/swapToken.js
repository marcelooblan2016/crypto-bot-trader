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
const swapHistory_1 = __importDefault(require("../../Records/swapHistory"));
const logger_1 = __importDefault(require("../../Records/logger"));
const token_1 = __importDefault(require("../../Records/token"));
function swapToken(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = params.page;
        const C = params.C;
        try {
            let tokenFrom = params.tokenFrom;
            let tokenTo = params.tokenTo;
            let amount = params.amount;
            let msgInit = [
                "Swapping token: in progress...",
                "Amount From: " + [amount, tokenFrom].join(" "),
                "Current Price: " + params.current_price,
                "TokenTo: " + tokenTo,
            ].join(" ");
            logger_1.default.write({ content: msgInit });
            let currentUrl = page.url();
            let tokenContracts = token_1.default.tokenContracts();
            let tokenFromContract = tokenContracts.filter((token) => token.slug == tokenFrom)[0];
            // chrome-extension://odkjoconjphbkgjmioaolohpdhgihomg/home.html#asset/0x2791bca1f2de4661ed88a30c99a7a9449aa84174
            let tokenFromBaseUrl = [
                C.urls.prefix,
                (currentUrl.match(/\/\/(.*?)\//i))[1],
                `/home.html#asset/${tokenFromContract.contract}`
            ].join("");
            yield page.goto(tokenFromBaseUrl, { waitUntil: 'domcontentloaded' });
            yield page.waitForXPath(C.elements.swap_token.button_swap_overview_xpath + "[not(@disabled)]", { visible: true });
            const [buttonSwapOverview] = yield page.$x(C.elements.swap_token.button_swap_overview_xpath);
            yield buttonSwapOverview.click();
            yield page.waitForTimeout(1000);
            // click swap from overview
            // **** TokenFrom
            // click dropdown option
            yield page.click(C.elements.swap_token.div_dropdown_search_list_pair);
            // type tokenFrom
            yield page.type(C.elements.swap_token.input_dropdown_input_pair, tokenFrom, { delay: 20 });
            yield page.waitForTimeout(2000);
            // select tokenFrom
            yield page.evaluate((options) => {
                const C = options['config'];
                let tokenFrom = options['tokenFrom'];
                [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair)].find(element => element.textContent.toLowerCase() === tokenFrom).click();
            }, {
                'tokenFrom': tokenFrom,
                'config': C
            });
            if (typeof amount == 'string') {
                switch (amount) {
                    case 'all':
                        // max amount
                        let isMaxButton = yield page.evaluate(function (C) {
                            return document.querySelectorAll(C.elements.swap_token.div_max_button).length >= 1 ? true : false;
                        }, C);
                        if (isMaxButton === true) {
                            yield page.click(C.elements.swap_token.div_max_button);
                        }
                        else { /* todo .build-quote__balance-message */ }
                        break;
                }
            }
            else {
                // type exact amount 
                yield page.type(C.elements.swap_token.input_amount_pair, (amount).toString(), { delay: 20 });
            }
            let amountAcquired = yield page.evaluate(function (C) {
                let inputAmountPair = document.querySelector(C.elements.swap_token.input_amount_pair).value;
                return Number(inputAmountPair);
            }, C);
            // **** TokenTo
            // click dropdown option
            yield page.click(C.elements.swap_token.div_dropdown_search_list_pair_to);
            // type tokenTo
            yield page.type(C.elements.swap_token.input_dropdown_input_pair_to, tokenTo, { delay: 20 });
            yield page.waitForTimeout(1000);
            // select tokenTo
            yield page.evaluate((options) => {
                const C = options['config'];
                let tokenTo = options['tokenTo'];
                [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair_to)].find(element => element.textContent.toLowerCase() === tokenTo).click();
            }, {
                'tokenTo': tokenTo,
                'config': C
            });
            yield page.waitForTimeout(1000);
            // if have confirmation
            let isButtonDangerContinue = yield page.evaluate((options) => {
                const C = options['config'];
                return document.querySelectorAll(C.elements.swap_token.button_swap_continue).length >= 1 ? true : false;
            }, { 'config': C });
            if (isButtonDangerContinue == true) {
                console.log("button continue found.");
                yield page.click(C.elements.swap_token.button_swap_continue);
                yield page.waitForTimeout(2000);
            }
            yield page.waitForXPath(C.elements.swap_token.button_swap_review_xpath + "[not(@disabled)]", { visible: true });
            const [buttonSwapReview] = yield page.$x(C.elements.swap_token.button_swap_review_xpath);
            // await buttonSwapReview.screenshot({path: 'button-swap-review.png'});
            // await buttonSwapReview.click();
            yield buttonSwapReview.click();
            yield page.waitForNavigation();
            yield page.waitForXPath(C.elements.swap_token.button_swap_xpath + "[not(@disabled)]", { visible: true });
            const [buttonSwap] = yield page.$x(C.elements.swap_token.button_swap_xpath);
            // buttonSwap.screenshot({path: 'button-swap.png'});
            yield buttonSwap.click();
            yield page.waitForNavigation();
            yield page.waitForXPath(C.elements.swap_token.div_transaction_complete_xpath, { visible: true });
            const [buttonClose] = yield page.$x(C.elements.swap_token.button_close_xpath);
            yield buttonClose.click();
            yield page.waitForNavigation();
            // save as history amountAcquired, current_price, slug
            swapHistory_1.default.write({
                amount_acquired: amountAcquired,
                amount_from: [amount, tokenFrom].join(" "),
                current_price: params.current_price,
                slug: tokenTo
            });
            let msg = [
                "Swapping token: successful",
                "Amount Acquired: " + amountAcquired,
                "Amount From: " + [amount, tokenFrom].join(" "),
                "Current Price: " + params.current_price,
                "TokenTo: " + tokenTo,
            ].join(" ");
            logger_1.default.write({ content: msg });
            return true;
        }
        catch (error) {
            // console.log(error);
            logger_1.default.write({ content: "Swapping token: failed" });
            logger_1.default.screenshot(page);
        }
        return false;
    });
}
exports.default = swapToken;
