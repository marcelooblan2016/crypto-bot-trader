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
function sendTo(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = params.page;
            const C = params.C;
            let currentUrl = page.url();
            let homeUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                "/home.html#send"
            ].join("");
            let walletAddress = (params.walletAddress).toString();
            let token = params.token;
            let amount = params.amount;
            yield page.goto(homeUrl, { waitUntil: 'domcontentloaded' });
            yield page.waitForTimeout(1000);
            // wait for xpath input wallet address
            const [inputWalletAddressXpath] = yield page.$x(C.elements.send_to.input_wallet_address_xpath);
            yield inputWalletAddressXpath.type(walletAddress);
            // click token option list
            yield page.waitForSelector(C.elements.send_to.div_dropdown_input_wrapper, {
                timeout: 15000
            });
            yield page.click(C.elements.send_to.div_dropdown_input_wrapper);
            yield page.waitForTimeout(1000);
            // select token
            yield page.waitForSelector(C.elements.send_to.div_token_list_item);
            yield page.evaluate((options) => {
                const C = options['config'];
                let token = options['token'];
                [...document.querySelectorAll(C.elements.send_to.div_token_list_item)].find(element => element.textContent.toLowerCase().includes(token) === true).click();
            }, {
                'token': token,
                'config': C
            });
            // type amount
            yield page.waitForXPath(C.elements.send_to.button_next_xpath + "[not(@disabled)]");
            yield page.waitForTimeout(5000);
            yield page.waitForSelector(C.elements.send_to.input_amount);
            yield page.type(C.elements.send_to.input_amount, (amount).toString(), { delay: 20 });
            yield page.waitForTimeout(3000);
            // next
            yield page.waitForXPath(C.elements.send_to.button_next_xpath + "[not(@disabled)]");
            const [buttonNextXpath] = yield page.$x(C.elements.send_to.button_next_xpath);
            yield buttonNextXpath.click();
            yield page.waitForNavigation();
            // confirm
            yield page.waitForXPath(C.elements.send_to.button_confirm_xpath + "[not(@disabled)]");
            const [buttonConfirmXpath] = yield page.$x(C.elements.send_to.button_confirm_xpath);
            yield buttonConfirmXpath.click();
            // logging
            let msg = [
                "Amount of " + [amount, token].join(" "),
                "has been sent into",
                walletAddress,
            ].join(" ");
            logger_1.default.write({ content: msg });
            return true;
        }
        catch (error) {
            console.log(error);
        }
        return false;
    });
}
exports.default = sendTo;
