import puppeteer from 'puppeteer';
import {Page, Browser} from 'puppeteer';
import * as dappeteer from '@chainsafe/dappeteer';
import C from '../constants';
import metaMaskLibs from "./Libs/lib";
import config from '../Records/config';
import logger from '../Records/logger';
import security from '../Records/security';
import token from '../Records/token';

class Metamask implements MetamaskInterface {
    public page: Page | null;
    protected browser: Browser | null;
    protected metamask: any;
    public C: object;
    public processId: number | string;
    public focus: string | null = null;
    public tokenContracts: tokenContractInterface[];
    public selectedTokenContracts: tokenContractInterface[];

    constructor(options? : any) {
        this.browser = null;
        this.page = null;
        this.metamask = null;
        this.C = C;
        this.processId = process.pid;
        this.tokenContracts = token.tokenContracts();
        this.selectedTokenContracts = this.tokenContracts;
    }
    /*
     * initializeSecurity : retrieve / set private key & encrypt it with passphrase
     */
    public async initializeSecurity(params: initializeSecurityParameters): Promise<string>
    {
        let pwd = params.pwd;
        let isSetup = typeof params['is_setup'] != 'undefined' ? params['is_setup'] : false;

        if (security.isKeyFileExists() == false) {
            await security.setKey();
        }
        
        let pKey: string | boolean = await security.retrieveKey(pwd, isSetup);
        if (pKey == false){
            logger.write({content: "Invalid keys, Exiting..."});
            process.exit(0);
        }

        return (pKey).toString();
    }
    /*
     * build : opens chromium, install metamask extensions, restore wallet, add new network, import preferred tokens
     * @return void
     */
    public async build (): Promise<void>
    {
        try {
            let args: any = process.argv.slice(2);
            let validArguments: any = {};
            if (args.length >= 1) {
                args = args.forEach( function (argument: string) {
                    let splittedArgument = argument.replace("--", "").split("=");
                    validArguments[splittedArgument[0]] = (splittedArgument[1] ?? null);
                });
            }
            
            // security pkey / passphrase
            let pwd: string | null = typeof validArguments['pwd'] != 'undefined' ? validArguments['pwd'] : null;

            let pKey: string = await this.initializeSecurity({pwd: pwd});

            // check if focus_only
            this.focus = typeof validArguments['focus'] != 'undefined' ? validArguments['focus'] : null;

            if (this.focus != null) {
                this.selectedTokenContracts = this.selectedTokenContracts.filter( (t) => [this.focus, 'usdc'].includes(t.slug) );
                if (this.selectedTokenContracts.length == 1) {
                    logger.write({content: `${this.focus} doesn't exists.`});
                    process.exit(0);
                }
            }
            // check if fresh start
            let envValues = config.envValues();
            if (typeof envValues['PROCESS_ID'] == 'undefined') {
                logger.write({content: "Fresh start, it may take at least a minute."});
            }

            // log process id
            config.update({key: "PROCESS_ID", value: process.pid});
            // launch browser
            logger.write({content: "Launching browser..."});
            this.browser = await dappeteer.launch(puppeteer, {
                metamaskVersion: C.metamask_version,
                args: ['--no-sandbox']
            });
    
            logger.write({content: "Setup metamask..."});
            this.metamask = await dappeteer.setupMetamask(this.browser, {});

            this.page = this.metamask.page;
            // import private key
            let privateKey: string = pKey;
            if (privateKey == null) {
                logger.write({content: "Private key required, exiting..."});
                process.exit(0);
            }

            await this.metamask.importPK(privateKey);
            // add new networks
            await this.addNewNetworks();
            // switch to preferred network
            //logger.write({content: `Switch network: ${C.network_preferred}`});
            // await this.switchNetwork(C.network_preferred);
            await this.page!.waitForTimeout(2000);
            // load tokens
            await this.loadTokenContracts();

        } catch (error) {
            console.log(error);
        }
    }
    /*
     * Import tokens with contracts
     * load erc-20 tokens for safe swapping
     * @return void
     */
    async loadTokenContracts (): Promise<void>
    {
        logger.write({content: `Import Tokens...`});
        await metaMaskLibs.loadTokenContracts({
            tokenContracts: this.selectedTokenContracts,
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
        logger.write({content: `Adding new networks...`});
        let networks = C.networks;
        let newNetworks = networks.filter( (network) => typeof network['new'] != 'undefined' && network['new'] == true);
        for (let index in newNetworks) {
            let network = newNetworks[index];

            logger.write({content: `Adding new networks ${network.slug}...`});
            /*
             * Disabled
            await this.metamask.addNetwork({
                networkName: network.slug,
                rpc: network.rpc_url,
                chainId: network.chain_id,
                symbol: network.currency_symbol,
                explorer: network.block_explorer_url,
            });
             */

            await metaMaskLibs.addNewNetwork({
                page: this.page,
                C: C,
                networkName: network.slug,
                rpc: network.rpc_url ?? '',
                chainId: Number(network.chain_id),
                symbol: network.currency_symbol ?? null,
                explorer: network.block_explorer_url ?? null,
            });
        }
    }
    /*
     * swapToken
     * @params String tokenFrom, String tokenTo, float|string amount ('all' for max balance)
     * @return boolean
     */
    async swapToken(tokenFrom: string, tokenTo: string, amount: number | string, current_price: number): Promise<boolean>
    {
        return await metaMaskLibs.swapToken({
            page: this.page,
            tokenFrom: tokenFrom,
            tokenTo: tokenTo,
            amount: amount,
            current_price: current_price,
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

    async clearPopups(): Promise<boolean>
    {
        // has Modal home
        let isHomeModal: boolean = await this.page!.evaluate((options) => {
            const C = options['config'];
            return document.querySelectorAll(C.elements.modals.home).length >= 1 ? true : false;
        }, {'config': C});

        if (isHomeModal == true) {
            logger.write({content: `Home modal found.`});
            await this.page!.click(C.elements.modals.home);
        }

        return true;
    }

    /*
     * Switching Network per element
     * @params (string) network
     * @return boolean
     */
    async switchNetwork(network: string): Promise<boolean>
    {
        return await metaMaskLibs.switchNetwork({
            page: this.page,
            network: network,
            C: C
        })
    }
}

export default new Metamask