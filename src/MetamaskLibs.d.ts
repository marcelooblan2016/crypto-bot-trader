import {Page} from 'puppeteer';
declare global {
    interface MetamaskLibsParameters {
        page: Page | null,
        C: any
    }
}
