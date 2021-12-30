import {Page} from 'puppeteer';
import swapHistory from '../../Records/swapHistory';
import logger from '../../Records/logger';
import tokenLibs from '../../Records/token';

interface SwapTokenParameters {
    page: Page | null, 
    tokenFrom: string, 
    tokenTo: string, 
    amount: number | string,
    current_price: number
    C: any
}

async function swapToken(params: SwapTokenParameters): Promise<boolean> {
    
    const page = params.page;
    const C = params.C;
    try {
        let tokenFrom: string = params.tokenFrom;
        let tokenTo: string = params.tokenTo;
        let amount: number | string = params.amount;

        let msgInit = [
            "Swapping token: in progress...",
            "Amount From: " + [amount, tokenFrom].join(" "),
            "Current Price: " + params.current_price,
            "TokenTo: " + tokenTo,
        ].join(" ");

        logger.write({content: msgInit});

        let currentUrl: string = page!.url();

        let tokenContracts = tokenLibs.tokenContracts();
        let tokenFromContract: tokenContractInterface = tokenContracts.filter( (token) => token.slug == tokenFrom)[0];
        // chrome-extension://odkjoconjphbkgjmioaolohpdhgihomg/home.html#asset/0x2791bca1f2de4661ed88a30c99a7a9449aa84174
        let tokenFromBaseUrl: string = [
            C.urls.prefix,
            (currentUrl.match(/\/\/(.*?)\//i))![1],
            `/home.html#asset/${tokenFromContract.contract}`
        ].join("");
        await page!.goto(tokenFromBaseUrl, { waitUntil: 'domcontentloaded' });
        await page!.waitForXPath(C.elements.swap_token.button_swap_overview_xpath + "[not(@disabled)]", { visible: true });
        const [buttonSwapOverview] = await page!.$x(C.elements.swap_token.button_swap_overview_xpath);
        await buttonSwapOverview.click();
        await page!.waitForTimeout(1000);
        // click swap from overview

        // **** TokenFrom
        // click dropdown option
        await page!.click(C.elements.swap_token.div_dropdown_search_list_pair);
        // type tokenFrom
        await page!.type(C.elements.swap_token.input_dropdown_input_pair, tokenFrom, {delay: 20});
        await page!.waitForTimeout(2000);
        // select tokenFrom
        await page!.evaluate((options) => {
            const C = options['config'];
            let tokenFrom = options['tokenFrom'];
            [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair)].find(element => element.textContent.toLowerCase() === tokenFrom).click();
        }, {
            'tokenFrom': tokenFrom,
            'config': C
        });
        
        if (typeof amount == 'string') {
            switch(amount) {
                case 'all':
                    // max amount
                    let isMaxButton: boolean = await page!.evaluate(function (C) {
                        return document.querySelectorAll(C.elements.swap_token.div_max_button).length >= 1 ? true : false;
                    }, C);
                    
                    if (isMaxButton === true) {await page!.click(C.elements.swap_token.div_max_button);}
                    else {/* todo .build-quote__balance-message */}
                break;
            }
        }
        else {
            // type exact amount 
            await page!.type(C.elements.swap_token.input_amount_pair, (amount).toString(), {delay: 20});
        }

        let amountAcquired: number = await page!.evaluate(function (C) {
            let inputAmountPair = document.querySelector(C.elements.swap_token.input_amount_pair).value;

            return Number(inputAmountPair);
        }, C);

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
        let isButtonDangerContinue: boolean = await page!.evaluate((options) => {
            const C = options['config'];
            return document.querySelectorAll(C.elements.swap_token.button_swap_continue).length >= 1 ? true : false;
        }, {'config': C});

        if (isButtonDangerContinue == true) {
            console.log("button continue found.");
            await page!.click(C.elements.swap_token.button_swap_continue)
            await page!.waitForTimeout(2000);
        }
        
        await page!.waitForXPath(C.elements.swap_token.button_swap_review_xpath + "[not(@disabled)]", { visible: true });
        const [buttonSwapReview] = await page!.$x(C.elements.swap_token.button_swap_review_xpath);
        await buttonSwapReview.click();
        await page!.waitForNavigation();
        await page!.waitForXPath(C.elements.swap_token.button_swap_xpath + "[not(@disabled)]", { visible: true });
        const [buttonSwap] = await page!.$x(C.elements.swap_token.button_swap_xpath);
        // buttonSwap.screenshot({path: 'button-swap.png'});
        await buttonSwap.click();
        await page!.waitForNavigation();
        await page!.waitForXPath(C.elements.swap_token.div_transaction_complete_xpath, { visible: true });
        const [buttonClose] = await page!.$x(C.elements.swap_token.button_close_xpath);
        await buttonClose.click();
        await page!.waitForNavigation();

        // save as history amountAcquired, current_price, slug
        swapHistory.write({
            amount_acquired: amountAcquired,
            amount_from: [amount, tokenFrom].join(" "),
            current_price: params.current_price,
            slug: tokenTo
        });
        
        let msg = [
            "Swapping token: successful",
            "Amount Acquired: " + amountAcquired,
            "Amount From: " + [amount, tokenFrom].join(" "),
            "Current Price: " + params.current_price,
            "TokenTo: " + tokenTo,
        ].join(" ");
        logger.write({content: msg});
        
        return true;
    } catch (error) {
        // console.log(error);
        logger.write({content: "Swapping token: failed"});
        logger.screenshot(page!);
    }

    return false;
}

export default swapToken