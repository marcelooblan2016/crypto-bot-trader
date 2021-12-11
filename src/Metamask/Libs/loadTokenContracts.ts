
async function loadTokenContracts(params: MetamaskLibsParameters): Promise<void> {
    const page = params.page;
    const C = params.C;
    try {

        let currentUrl: string = page!.url();

        let addTokenUrl: string = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html#add-token"
        ].join("");
        
        let jsonContractPath: string = '../tokenContracts.json';

        const fs = require('fs');
        let rawData: string = fs.readFileSync(jsonContractPath);

        let tokenContracts: tokenContractInterface[] = JSON.parse(rawData);

        for(let index in tokenContracts) {
            await page!.goto(addTokenUrl);
            let tokenContract: tokenContractInterface = tokenContracts[index];
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