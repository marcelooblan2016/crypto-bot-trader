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
function addNewNetwork(params) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         *                 networkName: network.slug,
                    rpc: network.rpc_url,
                    chainId: network.chain_id,
                    symbol: network.currency_symbol,
                    explorer: network.block_explorer_url,
         */
        const page = params.page;
        const C = params.C;
        let currentUrl = page.url();
        try {
            yield page.waitForTimeout(2000);
            yield page.click(C.elements.switch_network.div_network_display);
            yield page.evaluate((options) => {
                const C = options['config'];
                let network = options['network'];
                [...document.querySelectorAll(C.elements.switch_network.div_dropdown_network_list)].find(element => (new RegExp(network)).test(element.textContent)).click();
            }, {
                'network': "Custom RPC",
                'config': C
            });
            // Network Name
            yield page.waitForSelector(C.elements.add_new_network.input_network_name, { timeout: 15000 });
            yield page.type(C.elements.add_new_network.input_network_name, params.networkName);
            // RPC URL
            yield page.waitForSelector(C.elements.add_new_network.input_rpc_url, { timeout: 15000 });
            yield page.type(C.elements.add_new_network.input_rpc_url, params.rpc);
            // Chain ID
            if (params.chainId != null) {
                yield page.waitForSelector(C.elements.add_new_network.input_chain_id, { timeout: 15000 });
                yield page.type(C.elements.add_new_network.input_chain_id, (params.chainId).toString());
            }
            // Currency Symbol
            if (params.symbol != null) {
                yield page.waitForSelector(C.elements.add_new_network.input_currency_symbol, { timeout: 15000 });
                yield page.type(C.elements.add_new_network.input_currency_symbol, (params.symbol).toString());
            }
            // BlockChain Url
            if (params.explorer != null) {
                yield page.waitForSelector(C.elements.add_new_network.input_block_explorer_url, { timeout: 15000 });
                yield page.type(C.elements.add_new_network.input_block_explorer_url, (params.explorer).toString());
            }
            yield page.waitForXPath(C.elements.add_new_network.button_save_xpath + "[not(@disabled)]", { visible: true });
            const [buttonSave] = yield page.$x(C.elements.add_new_network.button_save_xpath);
            yield buttonSave.click();
            yield page.waitForTimeout(2000);
            yield page.click(C.elements.add_new_network.div_close_button);
            return true;
        }
        catch (error) {
            console.log(error);
        }
        return false;
    });
}
exports.default = addNewNetwork;
