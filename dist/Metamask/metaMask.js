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
const config_1 = __importDefault(require("../Records/config"));
const logger_1 = __importDefault(require("../Records/logger"));
const security_1 = __importDefault(require("../Records/security"));
const token_1 = __importDefault(require("../Records/token"));
class Metamask {
    constructor(options) {
        this.focus = null;
        this.method = 'basic'; // ['basic', 'sendto']
        this.browser = null;
        this.page = null;
        this.metamask = null;
        this.C = constants_1.default;
        this.processId = process.pid;
        this.tokenContracts = token_1.default.tokenContracts();
        this.selectedTokenContracts = this.tokenContracts;
    }
    /*
     * initializeSecurity : retrieve / set private key & encrypt it with passphrase
     */
    initializeSecurity(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let pwd = params.pwd;
            let isSetup = typeof params['is_setup'] != 'undefined' ? params['is_setup'] : false;
            if (security_1.default.isKeyFileExists() == false) {
                yield security_1.default.setKey();
            }
            let pKey = yield security_1.default.retrieveKey(pwd, isSetup);
            if (pKey == false) {
                logger_1.default.write({ content: "Invalid keys, Exiting..." });
                process.exit(0);
            }
            return (pKey).toString();
        });
    }
    /*
     * build : opens chromium, install metamask extensions, restore wallet, add new network, import preferred tokens
     * @return void
     */
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let args = process.argv.slice(2);
                let validArguments = {};
                if (args.length >= 1) {
                    args = args.forEach(function (argument) {
                        var _a;
                        let splittedArgument = argument.replace("--", "").split("=");
                        validArguments[splittedArgument[0]] = ((_a = splittedArgument[1]) !== null && _a !== void 0 ? _a : null);
                    });
                }
                this.method = typeof validArguments['method'] != 'undefined' ? validArguments['method'] : this.method;
                // security pkey / passphrase
                let pwd = typeof validArguments['pwd'] != 'undefined' ? validArguments['pwd'] : null;
                let pKey = yield this.initializeSecurity({ pwd: pwd });
                // check if focus_only
                this.focus = typeof validArguments['focus'] != 'undefined' ? validArguments['focus'] : null;
                if (this.focus != null) {
                    this.selectedTokenContracts = this.selectedTokenContracts.filter((t) => [this.focus, 'usdc'].includes(t.slug));
                    if (this.selectedTokenContracts.length == 1) {
                        logger_1.default.write({ content: `${this.focus} doesn't exists.` });
                        process.exit(0);
                    }
                }
                // check if fresh start
                let envValues = config_1.default.envValues();
                if (typeof envValues['PROCESS_ID'] == 'undefined') {
                    logger_1.default.write({ content: "Fresh start, it may take at least a minute." });
                }
                // log process id
                config_1.default.update({ key: "PROCESS_ID", value: process.pid });
                // launch browser
                logger_1.default.write({ content: "Launching browser..." });
                this.browser = yield dappeteer.launch(puppeteer_1.default, {
                    metamaskVersion: constants_1.default.metamask_version,
                    args: ['--no-sandbox']
                });
                logger_1.default.write({ content: "Setup metamask..." });
                this.metamask = yield dappeteer.setupMetamask(this.browser, {});
                this.page = this.metamask.page;
                // import private key
                let privateKey = pKey;
                if (privateKey == null) {
                    logger_1.default.write({ content: "Private key required, exiting..." });
                    process.exit(0);
                }
                yield this.metamask.importPK(privateKey);
                // add new networks
                yield this.addNewNetworks();
                // switch to preferred network
                //logger.write({content: `Switch network: ${C.network_preferred}`});
                yield this.switchNetwork(constants_1.default.network_preferred);
                yield this.page.waitForTimeout(2000);
                // load tokens
                yield this.loadTokenContracts();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    /*
     * Import tokens with contracts
     * load erc-20 tokens for safe swapping
     * @return void
     */
    loadTokenContracts() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.write({ content: `Import Tokens...` });
            yield lib_1.default.loadTokenContracts({
                tokenContracts: this.selectedTokenContracts,
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
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.write({ content: `Adding new networks...` });
            let networks = constants_1.default.networks;
            let newNetworks = networks.filter((network) => typeof network['new'] != 'undefined' && network['new'] == true);
            for (let index in newNetworks) {
                let network = newNetworks[index];
                logger_1.default.write({ content: `Adding new networks ${network.slug}...` });
                yield lib_1.default.addNewNetwork({
                    page: this.page,
                    C: constants_1.default,
                    networkName: network.slug,
                    rpc: (_a = network.rpc_url) !== null && _a !== void 0 ? _a : '',
                    chainId: Number(network.chain_id),
                    symbol: (_b = network.currency_symbol) !== null && _b !== void 0 ? _b : null,
                    explorer: (_c = network.block_explorer_url) !== null && _c !== void 0 ? _c : null,
                });
            }
        });
    }
    /*
     * swapToken
     * @params String tokenFrom, String tokenTo, float|string amount ('all' for max balance)
     * @return boolean
     */
    swapToken(tokenFrom, tokenTo, amount, current_price, description) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield lib_1.default.swapToken({
                page: this.page,
                tokenFrom: tokenFrom,
                tokenTo: tokenTo,
                amount: amount,
                current_price: current_price,
                C: constants_1.default,
                description: description
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
    clearPopups() {
        return __awaiter(this, void 0, void 0, function* () {
            // has Modal home
            let isHomeModal = yield this.page.evaluate((options) => {
                const C = options['config'];
                return document.querySelectorAll(C.elements.modals.home).length >= 1 ? true : false;
            }, { 'config': constants_1.default });
            if (isHomeModal == true) {
                logger_1.default.write({ content: `Home modal found.` });
                yield this.page.click(constants_1.default.elements.modals.home);
            }
            return true;
        });
    }
    /*
     * Switching Network per element
     * @params (string) network
     * @return boolean
     */
    switchNetwork(network) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield lib_1.default.switchNetwork({
                page: this.page,
                network: network,
                C: constants_1.default
            });
        });
    }
    /*
     * Send Specific amount to wallet address
     * @params walletAddress,
     * @return boolean
     */
    sendTo(walletAddress, token, amount, delay = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            if (delay > 0) {
                yield this.page.waitForTimeout(delay);
            }
            return yield lib_1.default.sendTo({
                page: this.page,
                C: constants_1.default,
                walletAddress: walletAddress,
                token: token,
                amount: amount
            });
        });
    }
    goHome() {
        return __awaiter(this, void 0, void 0, function* () {
            yield lib_1.default.goHome({
                page: this.page,
                C: constants_1.default,
            });
        });
    }
    delay(delay) {
        return __awaiter(this, void 0, void 0, function* () {
            yield lib_1.default.delay({
                page: this.page,
                C: constants_1.default,
                delay: delay
            });
        });
    }
}
exports.default = new Metamask;
