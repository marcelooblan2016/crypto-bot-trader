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
function swapToken(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = params.page;
            const C = params.C;
            let tokenFrom = params.tokenFrom;
            let tokenTo = params.tokenTo;
            let amount = params.amount;
            let currentUrl = page.url();
            let swapTokenUrl = [
                C.urls.prefix,
                (currentUrl.match(/\/\/(.*?)\//i))[1],
                "/home.html#swaps/build-quote"
            ].join("");
            yield page.goto(swapTokenUrl);
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
            //     -- todo
            const [buttonSwapReview] = yield page.$x(C.elements.swap_token.button_swap_review_xpath);
            buttonSwapReview.click();
            yield page.waitForNavigation();
            yield page.waitForXPath(C.elements.swap_token.button_swap_xpath);
            const [buttonSwap] = yield page.$x(C.elements.swap_token.button_swap_xpath);
            buttonSwap.click();
            yield page.waitForNavigation();
            yield page.waitForXPath(C.elements.swap_token.div_transaction_complete_xpath);
            const [buttonClose] = yield page.$x(C.elements.swap_token.button_close_xpath);
            buttonClose.click();
            yield page.waitForNavigation();
            console.log("Swapping token: successful");
            return true;
        }
        catch (error) {
            console.log("Swapping token: failed");
        }
        return false;
    });
}
exports.default = swapToken;
