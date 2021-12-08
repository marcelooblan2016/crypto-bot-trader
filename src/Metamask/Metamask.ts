import puppeteer from 'puppeteer';
import {Page, Browser} from 'puppeteer';
import * as dappeteer from '@chainsafe/dappeteer';
import C from '../constants';

class Metamask {
    protected page: Page | null;
    protected browser: Browser | null;
    protected metamask: any;

    constructor(options? : any) {
        this.browser = null;
        this.page = null;
        this.metamask = null;
    }

    public async build(): Promise<void>
    {
        console.log("Launching browser...");
        this.browser = await dappeteer.launch(puppeteer, {metamaskVersion: C.metamask_version });
        console.log("Setup metamask...");
        this.metamask = await dappeteer.setupMetamask(this.browser);
        this.page = this.metamask.page;
 
        process.exit(0);
    }
}

export default Metamask