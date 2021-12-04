const fs = require('fs');

async function loadTokenContracts(page) {
    let currentUrl = page.url();
    let addTokenUrl = [
        "chrome-extension://",
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
        await page.type('#custom-address', tokenContract['contract']);
        await page.type('#custom-symbol', tokenContract['slug']);
        await page.type('#custom-decimals', (tokenContract['decimals']).toString());
        await page.waitForTimeout(2000);
        const [buttonNext] = await page.$x("//button[contains(., 'Next')]");
        buttonNext.click();
        await page.waitForTimeout(1000);
        const [buttonAddTokens] = await page.$x("//button[contains(., 'Add Tokens')]");
        buttonAddTokens.click();
        await page.waitForTimeout(1000);
    }

    await page.waitForTimeout(999999);
}

module.exports.loadTokenContracts = loadTokenContracts;