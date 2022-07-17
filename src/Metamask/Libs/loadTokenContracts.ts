import token from '../../Records/token';
import logger from '../../Records/logger';

async function loadTokenContracts(params: MetamaskLibLoadTokenContractsParameters): Promise<void> {
    const page = params.page;
    const C = params.C;
    const tokenContracts: tokenContractInterface[] = params.tokenContracts;

    try {

        let currentUrl: string = page!.url();

        let addTokenUrl: string = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html#import-token"
        ].join("");

        for(let index in tokenContracts) {
            await page!.goto(addTokenUrl, {waitUntil: 'networkidle0'});
            await page!.waitForTimeout(1000);
            let isSearchAndCustomToken: boolean = await page!.evaluate((options) => {
            const C = options['config'];
                return document.querySelectorAll(C.elements.add_token.button_search_and_add_token).length >= 2 ? true : false;
            }, {'config': C});

            if (isSearchAndCustomToken === true) {
                await page!.waitForXPath(C.elements.add_token.button_custom_token_xpath);
                const [buttonCustomAddToken]: any = await page!.$x(C.elements.add_token.button_custom_token_xpath);
                await buttonCustomAddToken.click();
            }

            let tokenContract: tokenContractInterface = tokenContracts[index];
            logger.write({content: "Adding " + tokenContract['slug'] + " token ..."});
            await page!.waitForSelector(C.elements.add_token.input_contract_address);
            await page!.focus(C.elements.add_token.input_contract_address);
            await page!.type(C.elements.add_token.input_contract_address, tokenContract['contract']);
            await page!.waitForTimeout(2000);
            // check if enabled
            await page!.waitForSelector(C.elements.add_token.input_custom_symbol);
            let isDisabledInputSymbol: boolean = await page!.evaluate((options) => {
                const C = options['config'];
                    return document.querySelectorAll(`${C.elements.add_token.input_custom_symbol}:disabled`).length >= 1 ? true : false;
                }, {'config': C});
            if (isDisabledInputSymbol === false) {
                await page!.focus(C.elements.add_token.input_custom_symbol);
                await page!.type(C.elements.add_token.input_custom_symbol, tokenContract['slug']);
                await page!.waitForTimeout(1000);
            }
            // check if enabled
            await page!.waitForSelector(C.elements.add_token.input_custom_decimals);
            let isDisabledInputDecimals: boolean = await page!.evaluate((options) => {
                const C = options['config'];
                    return document.querySelectorAll(`${C.elements.add_token.input_custom_decimals}:disabled`).length >= 1 ? true : false;
                }, {'config': C});
            if (isDisabledInputDecimals === false) {
                await page!.focus(C.elements.add_token.input_custom_decimals);
                await page!.type(C.elements.add_token.input_custom_decimals, (tokenContract['decimals']).toString());
            }
            
            await page!.waitForXPath(C.elements.add_token.button_add_token_xpath + "[not(@disabled)]");
            const [buttonAddTokens]: any = await page!.$x(C.elements.add_token.button_add_token_xpath);
            await buttonAddTokens.click();

            await page!.waitForXPath(C.elements.add_token.button_import_tokens_xpath + "[not(@disabled)]");
            const [buttonImportTokens]: any = await page!.$x(C.elements.add_token.button_import_tokens_xpath);
            await buttonImportTokens.click();
            await page!.waitForNavigation();
        }
    } catch (error) {
        logger.write({content: JSON.stringify(error)});
    }
}

export default loadTokenContracts