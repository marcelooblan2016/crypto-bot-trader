async function swapToken(page, tokenFrom, tokenTo, amount, C) {
    console.log("Swapping token: " + tokenFrom + " >> " + tokenTo + " with value: " + amount);
    try {
        let currentUrl = page.url();
        let swapTokenUrl = [
            C.urls.prefix,
            (currentUrl.match(/\/\/(.*?)\//i))[1],
            "/home.html#swaps/build-quote"
        ].join("");
        await page.goto(swapTokenUrl);
        // **** TokenFrom
        // click dropdown option
        await page.click(C.elements.swap_token.div_dropdown_search_list_pair);
        // type tokenFrom
        await page.type(C.elements.swap_token.input_dropdown_input_pair, tokenFrom, {delay: 20});
        await page.waitForTimeout(1000);
        // select tokenFrom
        await page.evaluate((options) => {
            const C = options['config'];
            let tokenFrom = options['tokenFrom'];
            [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair)].find(element => element.textContent.toLowerCase() === tokenFrom).click();
        }, {
            'tokenFrom': tokenFrom,
            'config': C
        });
        // type amount
        await page.type(C.elements.swap_token.input_amount_pair, (amount).toString(), {delay: 20});
        // **** TokenTo
        // click dropdown option
        await page.click(C.elements.swap_token.div_dropdown_search_list_pair_to);
        // type tokenTo
        await page.type(C.elements.swap_token.input_dropdown_input_pair_to, tokenTo, {delay: 20});
        await page.waitForTimeout(1000);
        // select tokenTo
        await page.evaluate((options) => {
            const C = options['config'];
            let tokenTo = options['tokenTo'];
            [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair_to)].find(element => element.textContent.toLowerCase() === tokenTo).click();
        }, {
            'tokenTo': tokenTo,
            'config': C
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports.swapToken = swapToken;