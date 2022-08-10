"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const lib_1 = __importDefault(require("./Libs/lib"));
const api_coinmarketcap_1 = __importDefault(require("api.coinmarketcap"));
const swapHistory_1 = __importDefault(require("../Records/swapHistory"));
const logger_1 = __importDefault(require("../Records/logger"));
const config_1 = __importDefault(require("../Records/config"));
class Trader {
    constructor(contructorParams) {
        var _a;
        this.exceptionSlugs = ['matic', 'usdc'];
        this.metaMaskWithBuild = contructorParams.metamask_with_build;
        this.token = contructorParams.token;
        this.tokenContractList = this.token.tokenContracts();
        this.stableCoin = (_a = this.tokenContractList.filter(contract => contract.stablecoin == true)[0]) !== null && _a !== void 0 ? _a : null;
    }
    map(response_raw_data) {
        let tokenContracts = this.metaMaskWithBuild.selectedTokenContracts;
        return lib_1.default.map(response_raw_data, tokenContracts);
    }
    /*
     * analyzeMarket : Check wallet balance, decide if it will buy/sell base on the market
     * @params Any
     * @return boolean
     */
    analyzeMarket(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkpoint();
                logger_1.default.write({ content: "Analyzing market..." });
                yield this.metaMaskWithBuild.goHome();
                yield this.metaMaskWithBuild.clearPopups();
                // check stable coin balancebalance
                let tokenBalances = yield this.metaMaskWithBuild.getBalances();
                if (typeof tokenBalances == 'boolean') {
                    return false;
                }
                tokenBalances = (tokenBalances);
                let stableCoinBalance = (_a = tokenBalances.filter((token) => token.slug == this.stableCoin.slug).map(token => Number(token.balance))[0]) !== null && _a !== void 0 ? _a : null;
                // check if will sell or buy
                let responseData = yield api_coinmarketcap_1.default.getMarketPrices(1, 150, { tagSlugs: null });
                let mappedMarketData = this.map((responseData));
                // check token ready for sell
                yield this.sellMode({ mappedMarketData: mappedMarketData, tokenBalances: tokenBalances });
                yield this.buyMode({ tokenBalances: tokenBalances, mappedMarketData: mappedMarketData });
                logger_1.default.write({ content: "Market Analyzed." });
                return true;
            }
            catch (error) {
                let errorMessage = "An error occured.";
                if (error instanceof Error) {
                    errorMessage = [errorMessage, error.message].join(" ");
                }
                logger_1.default.write({ content: errorMessage });
            }
            return false;
        });
    }
    tokenWithBalanceAndMarketData(tokenBalances, mappedMarketData, filterType = 1) {
        let exceptionSlugs = this.exceptionSlugs;
        return (tokenBalances).filter(function (token) {
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
        }).map(function (token) {
            var _a;
            let tokenMarket = (_a = mappedMarketData.map((tokenMarket) => {
                let marketSlugFamiliars = [
                    { 'slug': 'wmatic', 'symbol': 'matic' },
                    { 'slug': 'weth', 'symbol': 'eth' },
                    { 'slug': 'wbtc', 'symbol': 'btc' },
                ];
                for (let marketSlug of marketSlugFamiliars) {
                    if (marketSlug.symbol == tokenMarket.symbol) {
                        tokenMarket.symbol = marketSlug.slug;
                        break;
                    }
                }
                return tokenMarket;
            })
                .filter((tokenMarket) => {
                return tokenMarket.symbol == token.slug;
            })[0]) !== null && _a !== void 0 ? _a : {};
            let swapHistoryDataFound = swapHistory_1.default.read({ slug: token.slug });
            let balanceInUSD = tokenMarket.current_price * token.balance;
            return Object.assign(Object.assign(Object.assign(Object.assign({}, token), tokenMarket), {
                history: swapHistoryDataFound
            }), {
                balance_in_usd: balanceInUSD,
                balance_nearest_a_usd: Math.round(balanceInUSD)
            });
        });
    }
    /*
     * sellMode : Check a profitable trades/losing trades do a necessary action with it.
     * @params Any
     * @return boolean
     */
    sellMode(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let mappedMarketData = params.mappedMarketData;
            // get token with balance except matic
            let tokenWithBalanceAndMarketData = this.tokenWithBalanceAndMarketData(params.tokenBalances, mappedMarketData);
            let sellCutLoss = lodash_1.default.get(this.metaMaskWithBuild.C, 'trading.options.sell_cutloss');
            let sellProfit = lodash_1.default.get(this.metaMaskWithBuild.C, 'trading.options.sell_profit');
            let filteredTokenWithProfitableBalance = tokenWithBalanceAndMarketData.filter((token) => token.balance_nearest_a_usd > 0);
            if (filteredTokenWithProfitableBalance.length < 1) {
                return false;
            }
            for (let token of filteredTokenWithProfitableBalance) {
                let tokenBalance = Number(lodash_1.default.get(token, 'balance'));
                let historyCurrentPrice = lodash_1.default.get(token, 'history.current_price', null);
                let currentPrice = lodash_1.default.get(token, 'current_price');
                // formula: c = (x2 - x1) / x1
                let gainsDecimal = (currentPrice - historyCurrentPrice) / historyCurrentPrice;
                let gainsPercentage = gainsDecimal * 100;
                let earnings = (tokenBalance * currentPrice) * gainsDecimal;
                let isSell = false;
                let msg = null;
                let profit = false;
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
                        profit = true;
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
                    logger_1.default.write({ content: msg });
                    let isSwapped = yield this.metaMaskWithBuild.swapToken(token.slug, this.stableCoin.slug, tokenBalance, currentPrice, msg);
                    if (profit === true && isSwapped === true) {
                        // 1 minute delay - for slow update of balance
                        yield this.metaMaskWithBuild.delay(60000);
                        // --method=sendto -> sends the profit to a specific wallet address
                        let method = this.metaMaskWithBuild.method;
                        let walletAddress = lodash_1.default.get(this.metaMaskWithBuild, 'C.methods.send_to');
                        let baseBalance = parseInt(lodash_1.default.get(this.metaMaskWithBuild, 'C.methods.base_amount'));
                        /* Get Update balance */
                        let balances = yield this.metaMaskWithBuild.getBalances();
                        let tokenSlug = this.stableCoin.slug;
                        let tokenBalance = (_a = balances.filter(function (token) {
                            return token.slug == tokenSlug;
                        })[0]) !== null && _a !== void 0 ? _a : null;
                        let usdcBalance = tokenBalance.balance;
                        // amountToSend = balance - baseBalance
                        let amountToSend = parseInt((usdcBalance - baseBalance).toString());
                        if (method == 'sendto' && amountToSend >= 1) {
                            yield this.metaMaskWithBuild.sendTo(walletAddress, this.stableCoin.slug, amountToSend, 0);
                        }
                    }
                }
            }
            return true;
        });
    }
    /*
     * buyMode : Check if there are tokens with dip within an hour or a day
     * @params Any
     * @return boolean
     */
    buyMode(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let tokenBalances = params.tokenBalances;
            let mappedMarketData = params.mappedMarketData;
            let stableCoinWithBalance = tokenBalances.filter((tokenBalance) => tokenBalance.slug == this.stableCoin.slug)[0];
            // ready to buy - select profitable tokens
            if (stableCoinWithBalance.balance >= 1) {
                let tokenWithBalanceAndMarketData = this.tokenWithBalanceAndMarketData(tokenBalances, mappedMarketData, 2);
                let tokenWithBalanceAndMarketDataExceptStableCoin = tokenWithBalanceAndMarketData
                    .filter((token) => token.slug != this.stableCoin.slug);
                stableCoinWithBalance = tokenWithBalanceAndMarketData
                    .filter((token) => token.slug == this.stableCoin.slug)[0];
                let percentList = [
                    { key: 'percent_change_1_hour', down: -1 },
                    { key: 'percent_change_1_day', down: -2 },
                ];
                let buyTokens = null;
                for (let percentDown of percentList) {
                    let downBy = percentDown.down;
                    let downByTokens = lodash_1.default.orderBy((tokenWithBalanceAndMarketDataExceptStableCoin).filter(function (token) {
                        return Number(token[percentDown.key]) <= downBy;
                    }), [percentDown.key], ['desc']);
                    if (downByTokens.length >= 1) {
                        buyTokens = downByTokens[0];
                        break;
                    }
                }
                if (buyTokens != null) {
                    let stableBalance = Number(stableCoinWithBalance.balance);
                    // buy / swap
                    let swapTokenMsg = [
                        `Buy/Swap Details: ${this.stableCoin.slug}`,
                        `Token: ${buyTokens.slug}`,
                        `Balance: ${stableBalance}`,
                        `Current Price: ${buyTokens.current_price}`
                    ].join(" ");
                    let msg = [swapTokenMsg, `Buy/Swap: ` + JSON.stringify(buyTokens)].join("\r\n");
                    logger_1.default.write({ content: msg });
                    yield this.metaMaskWithBuild.swapToken(this.stableCoin.slug, buyTokens.slug, stableBalance, buyTokens.current_price, msg);
                }
            }
            return true;
        });
    }
    /*
     * checkpoint : Stop trading at a certain point
     * @return void | boolean
     */
    checkpoint() {
        //CHECKPOINT_DATE
        let envValues = config_1.default.envValues();
        if (typeof envValues['CHECKPOINT_DATE'] == 'undefined') {
            return false;
        }
        let checkpointDate = envValues['CHECKPOINT_DATE'];
        console.log("checkpointDate: " + checkpointDate);
        let formattedMomentCheckPointDate = Number((0, moment_1.default)(checkpointDate).format('YYYYMMDDHHmmss'));
        let formattedMomentCurrentDate = Number((0, moment_1.default)().format('YYYYMMDDHHmmss'));
        console.log("formattedMomentCurrentDate: " + formattedMomentCurrentDate);
        // check if todays date >= checkpoint date then exit
        if (formattedMomentCurrentDate >= formattedMomentCheckPointDate) {
            logger_1.default.write({ content: `Checkpoint reached at: ${formattedMomentCheckPointDate}` });
            process.exit(0);
        }
    }
}
exports.default = Trader;
