import _ from 'lodash';
import traderLibs from "./Libs/lib";
import ApiCoinMarketCap from 'api.coinmarketcap';
import swapHistory from '../Records/swapHistory';
import logger from '../Records/logger';

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

        this.metaMaskWithBuild.clearPopups();

        if (typeof tokenBalances == 'boolean') { return false; }
        tokenBalances = (tokenBalances) as mappedTokenBalance[];
        let stableCoinBalance = tokenBalances.filter( (
            token: mappedTokenBalance) => token.slug == this.stableCoin.slug
        ).map( token => Number(token.balance))[0] ?? null;
        // check if will sell or buy

        let responseData = await ApiCoinMarketCap.getMarketPrices(1, 150, {tagSlugs: null});

        let mappedMarketData = this.map((responseData) as CoinMarketCap.CryptoListFromRawData);
        // check token ready for sell
        await this.sellMode({mappedMarketData: mappedMarketData, tokenBalances: tokenBalances});
        // await this.buyMode();

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

    private tokenWithBalanceAndMarketData (tokenBalances: mappedTokenBalance[], mappedMarketData: CoinMarketCap.Crypto[]) {
        let exceptionSlugs = this.exceptionSlugs;

        return (tokenBalances).filter( function (token) {
            if (!exceptionSlugs.includes(token.slug) && token.balance > 0) {
                return true;
            }
            return false;
        }).map( function (token) {
            let tokenMarket = mappedMarketData.filter( (tokenMarket) => tokenMarket.symbol == token.slug)[0] ?? {};
            let swapHistoryDataFound = swapHistory.read({slug: token.slug});
            let balanceInUSD: number = tokenMarket.current_price * token.balance;

            return {
                ...token,
                ...tokenMarket,
                ...{
                    history: swapHistoryDataFound
                },
                ...{
                    balance_in_usd: balanceInUSD,
                    balance_nearest_a_usd: Math.round(balanceInUSD)
                }
            };
        });
    }

    async sellMode(params: sellModeParameters): Promise<boolean> {
        let mappedMarketData = params.mappedMarketData;
        let exceptionSlugs = this.exceptionSlugs;
        console.log(params.tokenBalances);
        // get token with balance except matic
        let tokenWithBalanceAndMarketData = this.tokenWithBalanceAndMarketData(params.tokenBalances, mappedMarketData);
        
        let sellCutLoss = _.get(this.metaMaskWithBuild.C, 'trading.options.sell_cutloss');
        let sellProfit = _.get(this.metaMaskWithBuild.C, 'trading.options.sell_profit');
        let filteredTokenWithProfitableBalance = tokenWithBalanceAndMarketData.filter((token) => token.balance_nearest_a_usd > 0);
        console.log(filteredTokenWithProfitableBalance);

        if (filteredTokenWithProfitableBalance.length < 1) {
            return false;
        }

        for(let token of filteredTokenWithProfitableBalance) {
            let tokenBalance = _.get(token, 'balance');
            let historyCurrentPrice: number = _.get(token, 'history.current_price', null);
            let currentPrice: number = _.get(token, 'current_price');
            let gainsDecimal: number = (currentPrice - historyCurrentPrice) / currentPrice;
            let gainsPercentage: number = gainsDecimal * 100;
            let earnings = (tokenBalance * currentPrice) * gainsDecimal;
            let isSell: boolean = false;
            let msg: string | null = null;
            if (gainsPercentage >= sellProfit) {
                // sell profit
                msg = [
                    "Sell Profit: ",
                    gainsPercentage + "%",
                    token.slug,
                    "Earned: " + earnings + " usd",
                ].join(" ");

                isSell = true;
            }
            else if (gainsPercentage <= sellCutLoss) {
                // selling to prevent more loss
                let msg = [
                    "Cut Loss: ",
                    gainsPercentage + "%",
                    token.slug,
                    "Earned: " + earnings + " usd",
                ].join(" ");

                isSell = true;
            }

            if (isSell === true) {
                logger.write({content: msg!});
                await this.metaMaskWithBuild.swapToken(token.slug, this.stableCoin.slug, tokenBalance, currentPrice);
            }
        }
        
        return true;
    }

    async buyMode() {
        // todo
    }
}

export default Trader;