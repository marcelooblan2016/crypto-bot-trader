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
            let networkUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                `/home.html#settings/networks`
            ].join("");
            yield page.goto(networkUrl, { waitUntil: 'domcontentloaded' });
            // click add new network
            yield page.waitForXPath(C.elements.add_new_network.button_add_a_network_xpath + "[not(@disabled)]", { visible: true });
            const [buttonAddNewNetwork] = yield page.$x(C.elements.add_new_network.button_add_a_network_xpath);
            yield buttonAddNewNetwork.click();
            // Type Network Name
            const [inputNetworkNameXpath] = yield page.$x(C.elements.add_new_network.input_network_name_xpath);
            yield inputNetworkNameXpath.type(params.networkName);
            // Type input rpc url
            const [inputRpcUrlXpath] = yield page.$x(C.elements.add_new_network.input_rpc_url_xpath);
            yield inputRpcUrlXpath.type(params.rpc);
            // Type input chain id
            const [inputChainIdXpath] = yield page.$x(C.elements.add_new_network.input_chain_id_xpath);
            yield inputChainIdXpath.type(String(params.chainId));
            // Type currency symbol
            const [inputCurrencySymbolXpath] = yield page.$x(C.elements.add_new_network.input_currency_symbol_xpath);
            yield inputCurrencySymbolXpath.type(String(params.symbol));
            // Type Explorer
            const [inputExplorerXpath] = yield page.$x(C.elements.add_new_network.input_explorer_xpath);
            yield inputExplorerXpath.type(String(params.explorer));
            yield page.waitForTimeout(2000);
            yield page.waitForXPath(C.elements.add_new_network.button_save_xpath + "[not(@disabled)]");
            const [buttonSaveXpath] = yield page.$x(C.elements.add_new_network.button_save_xpath);
            yield buttonSaveXpath.click();
            return true;
        }
        catch (error) {
            console.log(error);
        }
        return false;
    });
}
exports.default = addNewNetwork;
