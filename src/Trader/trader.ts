import _ from 'lodash';
import traderLibs from "./Libs/lib";
import ApiCoinMarketCap from 'api.coinmarketcap';

interface contructorParameters {
    metamask_with_build: MetamaskInterface,
    token: Record.TokenInterface
}

interface sellModeParameters {
    mappedMarketData: CoinMarketCap.Crypto[],
    tokenBalances: mappedTokenBalance[]
}

class Trader {

    protected metaMaskWithBuild: MetamaskInterface;
    protected token: Record.TokenInterface;

    protected stableCoin: tokenContractInterface;
    protected tokenContractList: tokenContractInterface[];

    protected exceptionSlugs = ['matic', 'usdc'];
    
    constructor(contructorParams : contructorParameters) {
        this.metaMaskWithBuild = contructorParams.metamask_with_build;
        this.token = contructorParams.token;
        this.tokenContractList = this.token.tokenContracts();
        this.stableCoin = this.tokenContractList.filter( contract => contract.stablecoin == true)[0] ?? null;
    }

    private map (response_raw_data: CoinMarketCap.CryptoListFromRawData): CoinMarketCap.Crypto[] {
        let tokenContracts: tokenContractInterface[] = this.tokenContractList;
        
        return traderLibs.map(response_raw_data, tokenContracts);
    }
    /*
     * analyzeMarket : Check wallet balance, decide if it will buy/sell base on the market
     * @params Any
     * @return boolean
     */
    async analyzeMarket (params?: any): Promise<boolean> {
        try {
        // check stable coin balancebalance
        let tokenBalances = await this.metaMaskWithBuild.getBalances();
        if (typeof tokenBalances == 'boolean') { return false; }
        tokenBalances = (tokenBalances) as mappedTokenBalance[];
        let stableCoinBalance = tokenBalances.filter( (
            token: mappedTokenBalance) => token.slug == this.stableCoin.slug
        ).map( token => Number(token.balance))[0] ?? null;
        // check if will sell or buy
        let sellMode: boolean = false;
        if (stableCoinBalance <= 0) {
            sellMode = true;
        }

        let responseData = await ApiCoinMarketCap.getMarketPrices(1, 150, {tagSlugs: null});

        let mappedMarketData = this.map((responseData) as CoinMarketCap.CryptoListFromRawData);
        // console.log(mappedMarketData);
        // console.log(tokenBalances);

        if (sellMode == true) {
            await this.sellMode({mappedMarketData: mappedMarketData, tokenBalances: tokenBalances});
        }
        else {await this.buyMode();}


        // todo
        /**
         * Check if usdc (stable coin is empty)
         * ** If empty, it is ready to buy -> search for good token to buy per condition
         * ** else check token with balance, watch the token if it is good for sell per condition with a consideration of cutloss
         * ******* * Check if cutloss reached the max, or if profit to sell
         */
        
            return true;
        } catch (error) {}

        return false;
    }

    async sellMode(params: sellModeParameters) {
        let mappedMarketData = params.mappedMarketData;
        let exceptionSlugs = this.exceptionSlugs;
        // get token with balance except matic
        let tokenWithBalanceAndMarketData = (params.tokenBalances).filter( function (token) {
            if (!exceptionSlugs.includes(token.slug) && token.balance > 0) {
                return true;
            }
            return false;
        }).map( function (token) {
            let tokenMarket = mappedMarketData.filter( (tokenMarket) => tokenMarket.symbol == token.slug)[0] ?? {};

            return {
                ...token,
                ...tokenMarket
            };
        });
        
        console.log(tokenWithBalanceAndMarketData);
        
        // todo  / check from swapHistory compare -> sell if profit or cutloss
        process.exit(0);
    }

    async buyMode() {
        // todo
    }
}

export default Trader;