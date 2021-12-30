import token from '../../Records/token';

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

        let tokenContracts: tokenContractInterface[] = token.tokenContracts();

        for(let index in tokenContracts) {
            await page!.goto(addTokenUrl, {waitUntil: 'networkidle0'});
            await page!.waitForTimeout(1000);
            // check if <button>Search</button> <button>Custom Token</button> (Usually happens in windows 10 as per testing)
            let isSearchAndCustomToken: boolean = await page!.evaluate((options) => {
            const C = options['config'];
                return document.querySelectorAll(C.elements.add_token.button_search_and_add_token).length >= 2 ? true : false;
            }, {'config': C});

            if (isSearchAndCustomToken === true) {
                await page!.waitForXPath(C.elements.add_token.button_custom_token_xpath);
                const [buttonCustomAddToken] = await page!.$x(C.elements.add_token.button_custom_token_xpath);
                await buttonCustomAddToken.click();
            }

            let tokenContract: tokenContractInterface = tokenContracts[index];
            console.log("Adding " + tokenContract['slug'] + " token ...");
            await page!.waitForSelector(C.elements.add_token.input_contract_address);
            await page!.focus(C.elements.add_token.input_contract_address);
            await page!.type(C.elements.add_token.input_contract_address, tokenContract['contract']);
            await page!.waitForSelector(C.elements.add_token.input_custom_symbol);
            await page!.focus(C.elements.add_token.input_custom_symbol);
            await page!.type(C.elements.add_token.input_custom_symbol, tokenContract['slug']);
            await page!.waitForTimeout(1000);
            await page!.waitForSelector(C.elements.add_token.input_custom_decimals);
            await page!.focus(C.elements.add_token.input_custom_decimals);
            await page!.type(C.elements.add_token.input_custom_decimals, (tokenContract['decimals']).toString());
            await page!.waitForXPath(C.elements.add_token.button_next_xpath + "[not(@disabled)]");
            const [buttonNext] = await page!.$x(C.elements.add_token.button_next_xpath);
            await buttonNext.click();
            await page!.waitForXPath(C.elements.add_token.button_add_token_xpath + "[not(@disabled)]");
            const [buttonAddTokens] = await page!.$x(C.elements.add_token.button_add_token_xpath);
            await buttonAddTokens.click();
            await page!.waitForNavigation();
        }
    } catch (error) {
        console.log(error)
    }
}

export default loadTokenContracts