import _ from 'lodash';
import traderLibs from "./Libs/lib";
import ApiCoinMarketCap from 'api.coinmarketcap';

interface AnalyzeParameters {
    metamask_with_build: MetamaskInterface,
    token: Record.TokenInterface
}

interface contructorParamseters {
    metamask_with_build: MetamaskInterface,
    token: Record.TokenInterface
}

class Trader {

    protected metaMaskWithBuild: MetamaskInterface;
    protected token: Record.TokenInterface;

    protected stableCoin: tokenContractInterface;
    protected tokenContractList: tokenContractInterface[];
    
    constructor(contructorParams : contructorParamseters) {
        this.metaMaskWithBuild = contructorParams.metamask_with_build;
        this.token = contructorParams.token;
        this.tokenContractList = this.token.tokenContracts();
        this.stableCoin = this.tokenContractList.filter( contract => contract.stablecoin == true)[0] ?? null;
    }

    private map (response_raw_data: CoinMarketCap.CryptoListFromRawData): CoinMarketCap.Crypto[] {
        let tokenContracts: tokenContractInterface[] = this.tokenContractList;
        
        return traderLibs.map(response_raw_data, tokenContracts);
    }

    async analyzeMarket () {
        
        // console.log(this.stableCoin);
        let responseData = await ApiCoinMarketCap.getMarketPrices(1, 150, {tagSlugs: null});

        let mappedData = this.map((responseData) as CoinMarketCap.CryptoListFromRawData);
        console.log(mappedData);
        
        // todo
        /**
         * Check if usdc (stable coin is empty)
         * ** If empty, it is ready to buy -> search for good token to buy per condition
         * ** else check token with balance, watch the token if it is good for sell per condition with a consideration of cutloss
         * ******* * Check if cutloss reached the max, or if profit to sell
         */
        
        // is to Buy
        // is to Sell
    }
}

export default Trader;