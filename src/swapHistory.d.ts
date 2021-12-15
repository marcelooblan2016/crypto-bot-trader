export {};

declare global {
    namespace SwapHistoryNs {

        interface SwapHistoryInterface {
            write(params: SwapHistoryNs.writeParams): boolean,
            read(params: SwapHistoryNs.readParams): boolean 
        }

        interface swaps {
            slug: string,
            current_price: number,
            amount: number
        }
        
        interface writeParams {
            slug: string,
            current_price: number,
            amount: number
        }

        interface readParams {
            slug?: string
        }

    }
}