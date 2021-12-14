import puppeteer from 'puppeteer';
import {Page, Browser} from 'puppeteer';
import * as dappeteer from '@chainsafe/dappeteer';
import C from '../constants';
import metaMaskLibs from "./Libs/lib";

class Metamask implements MetamaskInterface {
    public page: Page | null;
    protected browser: Browser | null;
    protected metamask: any;

    constructor(options? : any) {
        this.browser = null;
        this.page = null;
        this.metamask = null;
    }
    /*
     * build : opens chromium, install metamask extensions, restore wallet, add new network, import preferred tokens
     * @return void
     */
    public async build (): Promise<void>
    {
        console.log("Launching browser...");
        this.browser = await dappeteer.launch(puppeteer, {metamaskVersion: C.metamask_version});
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
        // load tokens
        await this.loadTokenContracts();
    }
    /*
     * Import tokens with contracts
     * load erc-20 tokens for safe swapping
     * @return void
     */
    async loadTokenContracts (): Promise<void>
    {
        console.log("Import Tokens...");
        await metaMaskLibs.loadTokenContracts({
            page: this.page,
            C: C
        });
    }
    /*
     * addNewNetworks : List all available networks, filter new network then add it.
     * @return void
     */
    async addNewNetworks (): Promise<void>
    {
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
     * @params String tokenFrom, String tokenTo, float|string amount ('all' for max balance)
     * @return boolean
     */
    async swapToken(tokenFrom: string, tokenTo: string, amount: number | string): Promise<boolean>
    {
        return await metaMaskLibs.swapToken({
            page: this.page,
            tokenFrom: tokenFrom,
            tokenTo: tokenTo,
            amount: amount,
            C: C
        });
    }
    /*
     * getBalances
     * @params String tokenSlug (optional)
     * @return object
     */
    async getBalances(tokenSlug?: string): Promise<mappedTokenBalance[]|mappedTokenBalance|boolean>
    {
        return await metaMaskLibs.getBalances({
            page: this.page,
            token_slug: tokenSlug,
            C: C
        });
    }
}

export default new Metamask