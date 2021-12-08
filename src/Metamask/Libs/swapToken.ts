import {Page} from 'puppeteer';

interface SwapTokenParameters {
    page: Page | null, 
    tokenFrom: string, 
    tokenTo: string, 
    amount: number, 
    C: any
}

async function swapToken(params: SwapTokenParameters): Promise<boolean> {
    try {
        const page = params.page;
        const C = params.C;
        let tokenFrom: string;
        tokenFrom = params.tokenFrom;
        let tokenTo: string;
        tokenTo = params.tokenTo;
        let amount: number;
        amount = params.amount;
     
        let currentUrl: string;
        currentUrl = page!.url();

        let swapTokenUrl: string;
        swapTokenUrl = [
            C.urls.prefix,
            (currentUrl.match(/\/\/(.*?)\//i))![1],
            "/home.html#swaps/build-quote"
        ].join("");
        await page!.goto(swapTokenUrl);
        // **** TokenFrom
        // click dropdown option
        await page!.click(C.elements.swap_token.div_dropdown_search_list_pair);
        // type tokenFrom
        await page!.type(C.elements.swap_token.input_dropdown_input_pair, tokenFrom, {delay: 20});
        await page!.waitForTimeout(1000);
        // select tokenFrom
        await page!.evaluate((options) => {
            const C = options['config'];
            let tokenFrom = options['tokenFrom'];
            [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair)].find(element => element.textContent.toLowerCase() === tokenFrom).click();
        }, {
            'tokenFrom': tokenFrom,
            'config': C
        });
        // type amount
        await page!.type(C.elements.swap_token.input_amount_pair, (amount).toString(), {delay: 20});
        // **** TokenTo
        // click dropdown option
        await page!.click(C.elements.swap_token.div_dropdown_search_list_pair_to);
        // type tokenTo
        await page!.type(C.elements.swap_token.input_dropdown_input_pair_to, tokenTo, {delay: 20});
        await page!.waitForTimeout(1000);
        // select tokenTo
        await page!.evaluate((options) => {
            const C = options['config'];
            let tokenTo = options['tokenTo'];
            [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair_to)].find(element => element.textContent.toLowerCase() === tokenTo).click();
        }, {
            'tokenTo': tokenTo,
            'config': C
        });
        await page!.waitForTimeout(1000);
        // if have confirmation
        //     -- todo
        const [buttonSwapReview] = await page!.$x(C.elements.swap_token.button_swap_review_xpath);
        buttonSwapReview.click();
        await page!.waitForNavigation();
        await page!.waitForXPath(C.elements.swap_token.button_swap_xpath)
        const [buttonSwap] = await page!.$x(C.elements.swap_token.button_swap_xpath);
        buttonSwap.click();
        await page!.waitForNavigation();
        await page!.waitForXPath(C.elements.swap_token.div_transaction_complete_xpath);
        const [buttonClose] = await page!.$x(C.elements.swap_token.button_close_xpath);
        buttonClose.click();
        await page!.waitForNavigation();
        console.log("Swapping token: successful");
        
        return true;
    } catch (error) {
        console.log("Swapping token: failed");
    }

    return false;
}

export default swapToken