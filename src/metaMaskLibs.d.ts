import {Page, Browser} from 'puppeteer';
declare global {

    interface MetamaskInterface {
        C: object,
        page: Page | null,
        selectedTokenContracts: tokenContractInterface[],
        method: string,
        initializeSecurity (params: initializeSecurityParameters): Promise<string>,
        build(): Promise<void>,
        loadTokenContracts(): Promise<void>,
        addNewNetworks(): Promise<void>
        swapToken(tokenFrom: string, tokenTo: string, amount: number | string, current_price: number, description: string | null): Promise<boolean>,
        getBalances(tokenSlug?: string): Promise<mappedTokenBalance[]|mappedTokenBalance|boolean>
        clearPopups(): Promise<boolean>,
        sendTo(walletAddress: string, token: string, amount: number, delay: number): Promise<boolean>
        goHome(): Promise<void>
        delay(delay: number): Promise<void>
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

    interface sendToParameters {
        page: Page | null,
        C: any,
        walletAddress: string,
        token: string,
        amount: number,
    }

    interface goHomeParameters {
        page: Page | null,
        C: any,
    }

    interface delayParameters {
        page: Page | null,
        C: any,
        delay: number
    }
}
