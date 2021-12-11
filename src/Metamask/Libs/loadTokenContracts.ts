
async function loadTokenContracts(params: MetamaskLibsParameters): Promise<void> {
    const page = params.page;
    const C = params.C;
    try {

        let currentUrl: string;
        currentUrl = page!.url();

        let addTokenUrl: string;
        addTokenUrl = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html#add-token"
        ].join("");

        let homeUrl: string;
        homeUrl = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html"
        ].join("");
        
        let jsonContractPath: string;
        jsonContractPath = '../tokenContracts.json';

        let rawData: string;
        const fs = require('fs');
        rawData = fs.readFileSync(jsonContractPath);

        let tokenContracts: tokenContractInterface[];
        tokenContracts = JSON.parse(rawData);

        for(let index in tokenContracts) {
            let tokenContract: tokenContractInterface;
            await page!.goto(addTokenUrl);
            tokenContract =  tokenContracts[index];
            console.log("Adding " + tokenContract['slug'] + " token ...");
            await page!.focus(C.elements.add_token.input_contract_address);
            await page!.type(C.elements.add_token.input_contract_address, tokenContract['contract']);
            await page!.focus(C.elements.add_token.input_custom_symbol);
            await page!.type(C.elements.add_token.input_custom_symbol, tokenContract['slug']);
            await page!.waitForTimeout(1000);
            await page!.focus(C.elements.add_token.input_custom_decimals);
            await page!.type(C.elements.add_token.input_custom_decimals, (tokenContract['decimals']).toString());
            const [buttonNext] = await page!.$x(C.elements.add_token.button_next_xpath);
            buttonNext.click();
            await page!.waitForNavigation();
            const [buttonAddTokens] = await page!.$x(C.elements.add_token.button_add_token_xpath);
            buttonAddTokens.click();
            await page!.waitForNavigation();
        }
    } catch (error) {
        console.log(error)
        await page!.waitForTimeout(999999);
    }
}

export default loadTokenContracts