import tokenLibs from "./Libs/lib";

class Token implements Record.TokenInterface {

    constructor(options? : any) {}
    
    public tokenContracts (): tokenContractInterface[] {

        return tokenLibs.tokenContracts();
    }
}

export default new Token;