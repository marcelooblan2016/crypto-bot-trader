"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const puppeteer_1 = __importDefault(require("puppeteer"));
const dappeteer = __importStar(require("@chainsafe/dappeteer"));
const constants_1 = __importDefault(require("../constants"));
const lib_1 = __importDefault(require("./Libs/lib"));
class Metamask {
    constructor(options) {
        this.browser = null;
        this.page = null;
        this.metamask = null;
        this.C = constants_1.default;
    }
    /*
     * build : opens chromium, install metamask extensions, restore wallet, add new network, import preferred tokens
     * @return void
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Launching browser...");
            this.browser = yield dappeteer.launch(puppeteer_1.default, { metamaskVersion: constants_1.default.metamask_version });
            console.log("Setup metamask...");
            this.metamask = yield dappeteer.setupMetamask(this.browser);
            this.page = this.metamask.page;
            // import private key
            yield this.metamask.importPK(constants_1.default.private_key);
            // add new networks
            yield this.addNewNetworks();
            // switch to preferred network
            console.log("Switch network: " + constants_1.default.network_preferred);
            yield this.metamask.switchNetwork(constants_1.default.network_preferred);
            // load tokens
            yield this.loadTokenContracts();
        });
    }
    /*
     * Import tokens with contracts
     * load erc-20 tokens for safe swapping
     * @return void
     */
    loadTokenContracts() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Import Tokens...");
            yield lib_1.default.loadTokenContracts({
                page: this.page,
                C: constants_1.default
            });
        });
    }
    /*
     * addNewNetworks : List all available networks, filter new network then add it.
     * @return void
     */
    addNewNetworks() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Adding new networks...");
            let networks = constants_1.default.networks;
            let newNetworks = networks.filter((network) => typeof network['new'] != 'undefined' && network['new'] == true);
            for (let index in newNetworks) {
                let network = newNetworks[index];
                console.log("Adding network: " + network.slug);
                yield this.metamask.addNetwork({
                    networkName: network.slug,
                    rpc: network.rpc_url,
                    chainId: network.chain_id,
                    symbol: network.currency_symbol,
                    explorer: network.block_explorer_url,
                });
            }
        });
    }
    /*
     * swapToken
     * @params String tokenFrom, String tokenTo, float|string amount ('all' for max balance)
     * @return boolean
     */
    swapToken(tokenFrom, tokenTo, amount, current_price) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield lib_1.default.swapToken({
                page: this.page,
                tokenFrom: tokenFrom,
                tokenTo: tokenTo,
                amount: amount,
                current_price: current_price,
                C: constants_1.default
            });
        });
    }
    /*
     * getBalances
     * @params String tokenSlug (optional)
     * @return object
     */
    getBalances(tokenSlug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield lib_1.default.getBalances({
                page: this.page,
                token_slug: tokenSlug,
                C: constants_1.default
            });
        });
    }
}
exports.default = new Metamask;
