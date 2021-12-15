import tokenLibs from "./Libs/lib";

class Token implements Record.TokenInterface {
    
    private swapLogFilePath: string = '../swap.log';

    constructor(options? : any) {

    }
    
    public tokenContracts (): tokenContractInterface[] {

        return tokenLibs.tokenContracts();
    }
}

export default new Token;