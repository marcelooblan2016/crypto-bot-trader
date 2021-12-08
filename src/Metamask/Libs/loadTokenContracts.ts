const fs = require('fs');

interface tokenContractInterface {
    slug: string,
    contract: string,
    decimals: number
};

async function loadTokenContracts(params: MetamaskLibsParameters): Promise<void> {
    try {
        const page = params.page;
        const C = params.C;

        let currentUrl: string;
        currentUrl = page!.url();

        let addTokenUrl: string;
        addTokenUrl = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html#add-token"
        ].join("")
        
        let jsonContractPath: string;
        jsonContractPath = '../tokenContracts.json';

        let rawData: string;
        rawData = fs.readFileSync(jsonContractPath);

        let tokenContracts: tokenContractInterface[];
        tokenContracts = JSON.parse(rawData);

        for(let index in tokenContracts) {
            let tokenContract: tokenContractInterface;
            await page!.goto(addTokenUrl);
            tokenContract =  tokenContracts[index];
            console.log("Adding " + tokenContract['slug'] + " token ...");
            await page!.type(C.elements.add_token.input_contract_address, tokenContract['contract']);
            await page!.type(C.elements.add_token.input_custom_symbol, tokenContract['slug']);
            await page!.type(C.elements.add_token.input_custom_decimals, (tokenContract['decimals']).toString());
            await page!.waitForTimeout(2000);
            const [buttonNext] = await page!.$x(C.elements.add_token.button_next_xpath);
            buttonNext.click();
            await page!.waitForTimeout(1000);
            const [buttonAddTokens] = await page!.$x(C.elements.add_token.button_add_token_xpath);
            buttonAddTokens.click();
            await page!.waitForTimeout(2000);
        }
    } catch (error) {
        console.log(error)
    }
}

export default loadTokenContracts