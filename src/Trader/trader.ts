import _, { filter } from 'lodash';
import moment from 'moment';
import traderLibs from "./Libs/lib";
import ApiCoinMarketCap from 'api.coinmarketcap';
import swapHistory from '../Records/swapHistory';
import logger from '../Records/logger';
import config from '../Records/config';

interface contructorParameters {
    metamask_with_build: MetamaskInterface,
    token: Record.TokenInterface
}

interface sellModeParameters {
    mappedMarketData: CoinMarketCap.Crypto[],
    tokenBalances: mappedTokenBalance[]
}

interface buyModeParameters {
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
        let tokenContracts: tokenContractInterface[] = this.metaMaskWithBuild.selectedTokenContracts;
        
        return traderLibs.map(response_raw_data, tokenContracts);
    }
    /*
     * analyzeMarket : Check wallet balance, decide if it will buy/sell base on the market
     * @params Any
     * @return boolean
     */
    async analyzeMarket (params?: any): Promise<boolean> {

        try {
            this.checkpoint();
            logger.write({content: "Analyzing market..."});

            await this.metaMaskWithBuild.clearPopups();
            // check stable coin balancebalance
            let tokenBalances = await this.metaMaskWithBuild.getBalances();
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
            await this.buyMode({tokenBalances: tokenBalances, mappedMarketData: mappedMarketData});
        
            logger.write({content: "Market Analyzed."});

            return true;
        } catch (error) {}

        return false;
    }

    private tokenWithBalanceAndMarketData (tokenBalances: mappedTokenBalance[], mappedMarketData: CoinMarketCap.Crypto[], filterType: number = 1) {
        let exceptionSlugs = this.exceptionSlugs;
        return (tokenBalances).filter( function (token) {

            if (filterType == 2) {
                if (!['matic'].includes(token.slug)) {
                    return true;
                }
            }
            else {
                if (!exceptionSlugs.includes(token.slug) && token.balance > 0) {
                    return true;
                }
            }

            return false;
        }).map( function (token) {
            let tokenMarket = mappedMarketData.map((tokenMarket) => {
                let marketSlugFamiliars: any = [
                    {'slug': 'wmatic', 'symbol': 'matic'},
                    {'slug': 'weth', 'symbol': 'eth'},
                    {'slug': 'wbtc', 'symbol': 'btc'},
                ];

                for(let marketSlug of marketSlugFamiliars) {
                    if (marketSlug.symbol == tokenMarket.symbol) {
                        tokenMarket.symbol = marketSlug.slug;
                        break;
                    }
                }

                return tokenMarket;
            })
            .filter( (tokenMarket) => {

                return tokenMarket.symbol == token.slug;
            })[0] ?? {};
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
    /*
     * sellMode : Check a profitable trades/losing trades do a necessary action with it.
     * @params Any
     * @return boolean
     */
    async sellMode(params: sellModeParameters): Promise<boolean> {
        let mappedMarketData = params.mappedMarketData;
        // get token with balance except matic
        let tokenWithBalanceAndMarketData = this.tokenWithBalanceAndMarketData(params.tokenBalances, mappedMarketData);

        let sellCutLoss = _.get(this.metaMaskWithBuild.C, 'trading.options.sell_cutloss');
        let sellProfit = _.get(this.metaMaskWithBuild.C, 'trading.options.sell_profit');
        let filteredTokenWithProfitableBalance = tokenWithBalanceAndMarketData.filter((token) => token.balance_nearest_a_usd > 0);

        if (filteredTokenWithProfitableBalance.length < 1) {
            return false;
        }

        for(let token of filteredTokenWithProfitableBalance) {
            let tokenBalance = Number(_.get(token, 'balance'));
            let historyCurrentPrice: number = _.get(token, 'history.current_price', null);
            let currentPrice: number = _.get(token, 'current_price');
            // formula: c = (x2 - x1) / x1
            let gainsDecimal: number = (currentPrice - historyCurrentPrice) / historyCurrentPrice;

            let gainsPercentage: number = gainsDecimal * 100;
            let earnings = (tokenBalance * currentPrice) * gainsDecimal;
            let isSell: boolean = false;
            let msg: string | null = null;

            if (Number.isFinite(gainsPercentage) == true && Number.isFinite(sellProfit)) {
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
                    msg = [
                        "Cut Loss: ",
                        gainsPercentage + "%",
                        token.slug,
                        "Earned: " + earnings + " usd",
                    ].join(" ");
    
                    isSell = true;
                }
            }
            else {
                msg = [
                    `Infinity occured >>> `,
                    `tokenBalance: ${tokenBalance}`,
                    `currentPrice: ${currentPrice}`,
                    `historyCurrentPrice: ${historyCurrentPrice}`,
                ].join(" ");
            }

            if (isSell === true) {
                logger.write({content: msg!});
                await this.metaMaskWithBuild.swapToken(token.slug, this.stableCoin.slug, tokenBalance, currentPrice, msg);
            }
        }
        
        return true;
    }
    /*
     * buyMode : Check if there are tokens with dip within an hour or a day
     * @params Any
     * @return boolean
     */
    async buyMode(params: buyModeParameters): Promise <boolean> {
        let tokenBalances = params.tokenBalances;
        let mappedMarketData = params.mappedMarketData;

        let stableCoinWithBalance = tokenBalances.filter( (tokenBalance) => tokenBalance.slug == this.stableCoin.slug)[0];
        
        // ready to buy - select profitable tokens
        if (stableCoinWithBalance.balance >= 1) {
            let tokenWithBalanceAndMarketData = this.tokenWithBalanceAndMarketData(tokenBalances, mappedMarketData, 2);
            let tokenWithBalanceAndMarketDataExceptStableCoin = tokenWithBalanceAndMarketData
            .filter( (token) => token.slug != this.stableCoin.slug);
            stableCoinWithBalance = tokenWithBalanceAndMarketData
            .filter( (token) => token.slug == this.stableCoin.slug)[0];

            let percentList = [
                {key: 'percent_change_1_hour', down: -1},
                {key: 'percent_change_1_day', down: -2},
            ];

            let buyTokens = null;
            for(let percentDown of percentList) {
                let downBy: number = percentDown.down;
                let downByTokens = _.orderBy( (tokenWithBalanceAndMarketDataExceptStableCoin).filter( function (token: any) {

                    return Number(token[percentDown.key]) <= downBy;
                }), [percentDown.key], ['desc']);

                if (downByTokens.length >= 1) {
                    buyTokens = downByTokens[0];
                    break;
                }
            }

            if (buyTokens != null) {
                // buy / swap
                let msg = "Buy/Swap: " + JSON.stringify(buyTokens);
                logger.write({content: msg});
                await this.metaMaskWithBuild.swapToken(this.stableCoin.slug, buyTokens.slug, Number(stableCoinWithBalance.balance), buyTokens.current_price, msg);
            }
        }
        

        return true;
    }
    /*
     * checkpoint : Stop trading at a certain point
     * @return void | boolean
     */
    private checkpoint(): void | boolean {
        //CHECKPOINT_DATE
        let envValues = config.envValues();
        if (typeof envValues['CHECKPOINT_DATE'] == 'undefined') { return false;}
        
        let checkpointDate: string = envValues['CHECKPOINT_DATE'];
        console.log("checkpointDate: " + checkpointDate);
        let formattedMomentCheckPointDate: number = Number(moment(checkpointDate).format('YYYYMMDDHHmmss'));
        let formattedMomentCurrentDate: number = Number(moment().format('YYYYMMDDHHmmss'));
        console.log("formattedMomentCurrentDate: " + formattedMomentCurrentDate);
        // check if todays date >= checkpoint date then exit
        if (formattedMomentCurrentDate >= formattedMomentCheckPointDate) {
            logger.write({content: `Checkpoint reached at: ${formattedMomentCheckPointDate}`});
            process.exit(0);
        }
    }
}

export default Trader;