import {Page} from 'puppeteer';
declare global {
    interface MetamaskLibsParameters {
        page: Page | null,
        C: any
    }

    interface tokenContractInterface {
        slug: string,
        contract: string,
        decimals: number
    }
}