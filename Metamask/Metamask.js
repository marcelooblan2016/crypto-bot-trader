const puppeteer = require('puppeteer');
const dappeteer = require('@chainsafe/dappeteer');
const C = require('../constants');
const fs = require('fs');
const metaMaskLibs = require("./Libs/Lib");

class Metamask {
    constructor(options = null) {
        this.browser = null;
        this.page = null;
        this.metamask = null;
    }
    /*
     * build : opens chromium, install metamask extensions, restore wallet, add new network, import preferred tokens
     * @return void
     */
    async build () {
        console.log("Launching browser...");
        this.browser = await dappeteer.launch(puppeteer, {metamaskVersion: C.metamask_version });
        console.log("Setup metamask...");
        this.metamask = await dappeteer.setupMetamask(this.browser);
        this.page = this.metamask.page;
        // import private key
        await this.metamask.importPK(C.private_key);
        // add new networks
        await this.addNewNetworks();
        // switch to preferred network
        console.log("Switch network: " + C.network_preferred);
        await this.metamask.switchNetwork(C.network_preferred);
        console.log("Import Tokens...");
        await metaMaskLibs.loadTokenContracts(this.page, C);
        await this.page.waitForTimeout(5000);
        // token swap
        await this.swapToken(this.page, 'matic', 'usdc', 0.15);
        // await this.page.waitForTimeout(999999);
        // process.exit(0);
        // import tokens

        await this.page.waitForTimeout(999999);
    }
    /*
     * addNewNetworks : List all available networks, filter new network then add it.
     * @return void
     */
    async addNewNetworks () {
        console.log("Adding new networks...");
        let networks = C.networks;
        let newNetworks = networks.filter( (network) => typeof network['new'] != 'undefined' && network['new'] == true);
        for (let index in newNetworks) {
            let network = newNetworks[index];
            console.log("Adding network: " + network.slug);
            await this.metamask.addNetwork({
                networkName: network.slug,
                rpc: network.rpc_url,
                chainId: network.chain_id,
                symbol: network.currency_symbol,
                explorer: network.block_explorer_url,
            });
        }
    }
    /*
     * swapToken
     * @params Page page, String tokenFrom, String tokenTo
     * @return boolean
     */
    async swapToken(page, tokenFrom, tokenTo, amount) {
        await metaMaskLibs.swapToken(this.page, tokenFrom, tokenTo, amount, C);
    }
}

module.exports = Metamask;