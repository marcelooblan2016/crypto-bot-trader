
import token from './token';
const fs = require('fs');

class SwapHistory implements SwapHistoryNs.SwapHistoryInterface {
    
    private swapHistoryFilePath: string = '../swapHistory.json';

    constructor(options? : any) {

        if (!fs.existsSync(this.swapHistoryFilePath)) {
            let tokenContracts: SwapHistoryNs.swaps[] = token.tokenContracts().map( function (token) {
                return {
                    slug: token.slug,
                    current_price: 0,
                    amount: 0
                };
            });
            let initialContent: string = JSON.stringify(tokenContracts);
            fs.writeFileSync(this.swapHistoryFilePath, initialContent);
        }
    }

    public write(params: SwapHistoryNs.writeParams): boolean {
        let swapHistoryData: SwapHistoryNs.swaps[] = JSON.parse(fs.readFileSync(this.swapHistoryFilePath, 'utf8'));
        for (let index in swapHistoryData) {
            let currentSwap: SwapHistoryNs.swaps = swapHistoryData[index];
            if (currentSwap.slug == params.slug) {
                swapHistoryData[index].amount = params.amount;
                swapHistoryData[index].current_price = params.current_price;
                break;
            }
        }
        
        fs.writeFileSync(this.swapHistoryFilePath, JSON.stringify(swapHistoryData));
        
        return true;
    }

    public read(params: SwapHistoryNs.readParams): boolean {
        
        return true;
    }
    
}

export default new SwapHistory;