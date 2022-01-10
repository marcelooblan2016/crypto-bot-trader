import {Page, Browser} from 'puppeteer';
declare global {

    interface MetamaskInterface {
        C: object,
        page: Page | null,
        selectedTokenContracts: tokenContractInterface[],
        initializeSecurity (params: initializeSecurityParameters): Promise<string>,
        build(): Promise<void>,
        loadTokenContracts(): Promise<void>,
        addNewNetworks(): Promise<void>
        swapToken(tokenFrom: string, tokenTo: string, amount: number | string, current_price: number): Promise<boolean>,
        getBalances(tokenSlug?: string): Promise<mappedTokenBalance[]|mappedTokenBalance|boolean>
        clearPopups(): Promise<boolean>
    }

    interface MetamaskLibsParameters {
        page: Page | null,
        C: any
    }

    interface MetamaskLibLoadTokenContractsParameters {
        tokenContracts: tokenContractInterface[],
        page: Page | null,
        C: any
    }

    interface initializeSecurityParameters {
        pwd: string | null,
        is_setup?: boolean
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
