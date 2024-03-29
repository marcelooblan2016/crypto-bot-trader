import {Page} from 'puppeteer';
import swapHistory from '../../Records/swapHistory';
import mailer from "../../Records/mailer";
import slack from "../../Records/slack";
import logger from '../../Records/logger';
import tokenLibs from '../../Records/token';

interface SwapTokenParameters {
    page: Page | null, 
    tokenFrom: string, 
    tokenTo: string, 
    amount: number | string,
    current_price: number
    C: any,
    description: string | null,
}

async function swapToken(params: SwapTokenParameters): Promise<boolean> {
    
    const page = params.page;
    const C = params.C;
    let currentUrl: string = page!.url();
    let description: string | null = params.description;

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

        let tokenContracts = tokenLibs.tokenContracts();
        let tokenFromContract: tokenContractInterface = tokenContracts.filter( (token) => token.slug == tokenFrom)[0];
        let tokenToContract: tokenContractInterface = tokenContracts.filter( (token) => token.slug == tokenTo)[0];
        // chrome-extension://odkjoconjphbkgjmioaolohpdhgihomg/home.html#asset/0x2791bca1f2de4661ed88a30c99a7a9449aa84174
        let tokenFromBaseUrl: string = [
            C.urls.prefix,
            (currentUrl.match(/\/\/(.*?)\//i))![1],
            `/home.html#asset/${tokenFromContract.contract}`
        ].join("");
        await page!.goto(tokenFromBaseUrl, { waitUntil: 'domcontentloaded' });
        await page!.waitForXPath(C.elements.swap_token.button_swap_overview_xpath + "[not(@disabled)]", { visible: true });
        const [buttonSwapOverview]: any = await page!.$x(C.elements.swap_token.button_swap_overview_xpath);
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

        try {
            await page!.evaluate((options) => {
                const C = options['config'];
                let tokenTo = options['tokenTo'];
                [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair_to)].find(element => element.textContent.toLowerCase() === tokenTo).click();
            }, {
                'tokenTo': tokenTo,
                'config': C
            });
        } catch (subError) {
            console.log("token not found, attempting it by contract");
            //tokenToContract
            await page!.focus(C.elements.swap_token.input_dropdown_input_pair_to);
            await page!.keyboard.down('Control');
            await page!.keyboard.press('A');
            await page!.keyboard.up('Control');
            await page!.keyboard.press('Backspace');

            await page!.type(C.elements.swap_token.input_dropdown_input_pair_to, tokenToContract.contract, {delay: 20});
            await page!.waitForTimeout(1000);

            await page!.evaluate((options) => {
                const C = options['config'];
                let tokenTo = options['tokenTo'];
                [...document.querySelectorAll(C.elements.swap_token.label_dropdown_option_pair_to)][0].click();
            }, {
                'tokenTo': tokenTo,
                'config': C
            });

            await page!.waitForTimeout(3000);
        }
        await page!.waitForTimeout(3000);
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
        // swap review
        await page!.waitForTimeout(2000);
        await page!.waitForXPath(C.elements.swap_token.button_swap_review_xpath + "[not(@disabled)]", { visible: true });
        const [buttonSwapReview]: any = await page!.$x(C.elements.swap_token.button_swap_review_xpath);
        await buttonSwapReview.click();

        // if have confirmation
        let isActionableMessageButton: boolean = await page!.evaluate((options) => {
            const C = options['config'];
            return document.querySelectorAll(C.elements.swap_token.button_swap_continue).length >= 1 ? true : false;
        }, {'config': C});
        if (isActionableMessageButton == true) {
            console.log("actionable message found.");
            await page!.click(C.elements.swap_token.button_swap_continue)
            await page!.waitForTimeout(2000);
        }
        // attempt to click warning if presented
        try {
            await page!.waitForXPath(C.elements.swap_token.button_swap_warning_xpath + "[not(@disabled)]", { visible: true, timeout: 10000 });
            const [buttonIUnderstandWarning]: any = await page!.$x(C.elements.swap_token.button_swap_warning_xpath);
            await buttonIUnderstandWarning.click();
        } catch (e) {}

        await page!.waitForTimeout(2000);
        await page!.waitForXPath(C.elements.swap_token.button_swap_xpath + "[not(@disabled)]", { visible: true });
        const [buttonSwap]: any = await page!.$x(C.elements.swap_token.button_swap_xpath);
        await buttonSwap.click();
        await page!.waitForNavigation();
        await page!.waitForXPath(C.elements.swap_token.div_transaction_complete_xpath, { visible: true, timeout: 180000 });
        const [buttonClose]: any = await page!.$x(C.elements.swap_token.button_close_xpath);
        await buttonClose.click();
        await page!.waitForNavigation();
        // save as history amountAcquired, current_price, slug
        swapHistory.write({
            amount_acquired: amountAcquired,
            amount_from: [amount, tokenFrom].join(" "),
            current_price: params.current_price,
            slug: tokenTo
        });
        let title = `Swapping token: successful from: ${C.app_name}`;
        let msg = [
            title,
            "Amount Acquired: " + amountAcquired,
            "Amount From: " + [amount, tokenFrom].join(" "),
            "Current Price: " + params.current_price,
            "TokenTo: " + tokenTo,
        ].join(" ");
        logger.write({content: msg});
        
        let content: string = [
            msg,
            description,
        ].join(" >>>> ");
        // if email is available
        if (mailer.isMailerAvailable() === true) {
            await mailer.send({subject: title, message: content} as RecordMailer.sendParams);
        }
        // if slack is available
        if (slack.isSlackAvailable() === true) {
            await slack.send({text: content });
        }

        return true;
    } catch (error) {
        console.log(error);
        await page!.waitForTimeout(99999);

        logger.write({content: "Swapping token: failed"});
        logger.screenshot(page!);
        logger.write({content: "Redirecting to home..."});
        let baseUrl: string = [
            C.urls.prefix,
            (currentUrl.match(/\/\/(.*?)\//i))![1],
            `/home.html`
        ].join("");
        await page!.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    }

    return false;
}

export default swapToken