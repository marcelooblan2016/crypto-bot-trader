import {Page, Browser} from 'puppeteer';
declare global {

    interface MetamaskInterface {
        C: object,
        page: Page | null,
        build(): Promise<void>,
        loadTokenContracts(): Promise<void>,
        addNewNetworks(): Promise<void>
        swapToken(tokenFrom: string, tokenTo: string, amount: number | string, current_price: number): Promise<boolean>,
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
        minimum_balance: number
    }

    interface mappedTokenBalance {
        balance: number,
        slug: string,
        token_raw: string | null
    }
}
