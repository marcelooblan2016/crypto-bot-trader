export {};

declare global {
    namespace SwapHistoryNs {

        interface SwapHistoryInterface {
            write(params: SwapHistoryNs.writeParams): boolean,
            read(params: SwapHistoryNs.readParams): swaps | null
        }

        interface swaps {
            slug: string,
            current_price: number,
            amount_acquired: number,
            amount_from: number | string
        }
        
        interface writeParams {
            slug: string,
            current_price: number,
            amount_acquired: number,
            amount_from: number | string
        }

        interface readParams {
            slug: string
        }

    }
}