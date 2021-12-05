const fs = require('fs');

async function loadTokenContracts(page, C) {
    try {
        let currentUrl = page.url();
        let addTokenUrl = [
            C.urls.prefix,
            (currentUrl.match(/\/\/(.*?)\//i))[1],
            "/home.html#add-token"
        ].join("")
        
        let jsonContractPath = './tokenContracts.json';
        let rawData = fs.readFileSync(jsonContractPath);
        let tokenContracts = JSON.parse(rawData);
        for(let index in tokenContracts) {
            await page.goto(addTokenUrl);
            let tokenContract = tokenContracts[index];
            console.log("Adding " + tokenContract['slug'] + " token ...");
            await page.type(C.elements.add_token.input_contract_address, tokenContract['contract']);
            await page.type(C.elements.add_token.input_custom_symbol, tokenContract['slug']);
            await page.type(C.elements.add_token.input_custom_decimals, (tokenContract['decimals']).toString());
            await page.waitForTimeout(2000);
            const [buttonNext] = await page.$x(C.elements.add_token.button_next);
            buttonNext.click();
            await page.waitForTimeout(1000);
            const [buttonAddTokens] = await page.$x(C.elements.add_token.button_add_token);
            buttonAddTokens.click();
            await page.waitForTimeout(1000);
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports.loadTokenContracts = loadTokenContracts;