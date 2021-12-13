import {Page, Browser} from 'puppeteer';
declare global {

    interface MetamaskInterface {
        page: Page | null,
        build(): Promise<void>,
        loadTokenContracts(): Promise<void>,
        addNewNetworks(): Promise<void>
        swapToken(tokenFrom: string, tokenTo: string, amount: number | string): Promise<boolean>,
        getBalances(tokenSlug?: string): Promise<mappedTokenBalance[]|mappedTokenBalance|boolean>
    }

    interface MetamaskLibsParameters {
        page: Page | null,
        C: any
    }

    interface tokenContractInterface {
        slug: string,
        contract: string,
        decimals: number,
        stablecoin: boolean,
    }

    interface mappedTokenBalance {
        balance: number,
        slug: string,
        token_raw: string | null
    }
}
