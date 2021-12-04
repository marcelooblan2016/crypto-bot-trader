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
        // import tokens
        console.log("Import Tokens...");
        await metaMaskLibs.loadTokenContracts(this.page);

        await this.page.waitForTimeout(999999);
    }

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

    selectPreferredNetwork () {
        let networks = C.networks;
        return networks.filter( (network) => network.slug == C.network_preferred)[0]['slug'];
    }
}

module.exports = Metamask;