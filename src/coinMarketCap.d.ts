export {};

declare global {
    namespace CoinMarketCap {

        interface CryptoListFromRawData {
            cryptoCurrencyList: Array<object>,
            totalCount: string
        }

        interface Crypto {
            name: string,
            symbol: string,
            current_price: number,
            percent_change_1_hour: number,
            percent_change_1_day: number,
            percent_change_1_week: number,
            percent_change_1_month: number,
            percent_change_2_month: number,
            percent_change_3_month: number,
            dominance: number,
            turnover: number,
            total_supply: number,
            max_supply: number | null,
            circulating_supply: number,
            is_active: number,
            market_pair_count: number,
            rank: number
        }
    }
}