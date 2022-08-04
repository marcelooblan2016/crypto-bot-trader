import {Page} from 'puppeteer';
import logger from '../../Records/logger';

async function sendTo(params: sendToParameters): Promise<boolean> {
    try {
        const page = params.page;
        const C = params.C;
        let currentUrl: string = page!.url();

        let homeUrl: string = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html#send"
        ].join("");

        let walletAddress = (params.walletAddress).toString();
        let token = params.token;
        let amount = params.amount;

        await page!.goto(homeUrl, { waitUntil: 'domcontentloaded' });
        await page!.waitForTimeout(1000);
        // wait for xpath input wallet address
        const [inputWalletAddressXpath] = await page!.$x(C.elements.send_to.input_wallet_address_xpath);
        await inputWalletAddressXpath.type(walletAddress);
        // click token option list
        await page!.waitForSelector(C.elements.send_to.div_dropdown_input_wrapper, {
            timeout: 15000
        });
        await page!.click(C.elements.send_to.div_dropdown_input_wrapper);
        await page!.waitForTimeout(1000);
        // select token
        await page!.waitForSelector(C.elements.send_to.div_token_list_item);
        await page!.evaluate((options) => {
            const C = options['config'];
            let token = options['token'];
            [...document.querySelectorAll(C.elements.send_to.div_token_list_item)].find(element => element.textContent.toLowerCase().includes(token) === true).click();
        }, {
            'token': token,
            'config': C
        });
        // type amount
        await page!.waitForXPath(C.elements.send_to.button_next_xpath + "[not(@disabled)]");
        await page!.waitForTimeout(5000);
        await page!.waitForSelector(C.elements.send_to.input_amount);
        await page!.type(C.elements.send_to.input_amount, (amount).toString(), {delay: 20});
        await page!.waitForTimeout(3000);
        // next
        await page!.waitForXPath(C.elements.send_to.button_next_xpath + "[not(@disabled)]");
        const [buttonNextXpath]: any = await page!.$x(C.elements.send_to.button_next_xpath);
        await buttonNextXpath.click();
        await page!.waitForNavigation();
        // confirm
        await page!.waitForXPath(C.elements.send_to.button_confirm_xpath + "[not(@disabled)]");
        const [buttonConfirmXpath]: any = await page!.$x(C.elements.send_to.button_confirm_xpath);
        await buttonConfirmXpath.click();
        // logging
        let msg = [
            "Amount of " + [amount, token].join(" "),
            "has been sent into",
            walletAddress,
        ].join(" ");
        logger.write({content: msg});

        return true;
    } catch (error) {
        console.log(error);
    }

    return false;
}

export default sendTo