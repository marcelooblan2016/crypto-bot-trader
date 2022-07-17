import {Page} from 'puppeteer';

interface getBalanceParameters {
    page: Page | null,
    token_slug?: string,
    C: any
}

async function getBalances(params: getBalanceParameters): Promise<mappedTokenBalance[]|mappedTokenBalance|boolean> {
    try {
        let tokenSlug: string | any = typeof params.token_slug != 'undefined' ? params.token_slug : null;
        // get all token balance
        if (tokenSlug == null) {return await getBalanceAll(params);}
        // get balance bytoken
        else {return await getBalanceByToken(params);}

    } catch (error) {
        console.log(error)
    }

    return false;
}

async function getBalanceByToken(params: getBalanceParameters): Promise<mappedTokenBalance|boolean> {
    try {
        let tokenSlug: string | any = params.token_slug;

        let jsonContractPath: string = '../tokenContracts.json';
        let rawData: string;
        const fs = require('fs');
        rawData = fs.readFileSync(jsonContractPath);

        let tokenContracts: tokenContractInterface[];
        tokenContracts = JSON.parse(rawData);
        tokenContracts = tokenContracts.filter( (contract) => contract.slug == tokenSlug);
        let tokenContract: tokenContractInterface = tokenContracts[0];
 
        const page = params.page;
        const C = params.C;
        let currentUrl: string = page!.url();

        let assetUrl: string = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            `/home.html#asset/${tokenContract.contract}`
        ].join("");
        await page!.goto(assetUrl, { waitUntil: 'domcontentloaded' });
        await page!.waitForTimeout(1000);

        await page!.waitForSelector(C.elements.get_balances.div_primary_balance , {
            timeout: 15000
        });

        let primaryBalance: number = await page!.evaluate( function (C) {
            let rawBalance: string | null = (document.querySelector(C.elements.get_balances.div_primary_balance) as HTMLElement).innerText;
            let splitted: Array<string> = rawBalance.split("\n");
            return Number(splitted[0]);
        }, C);

        return {
            'balance': primaryBalance,
            'slug': tokenContract.slug,
            'token_raw': null,
        };
            
    } catch (error) {
        console.log(error)
    }

    return false;
}

async function getBalanceAll(params: getBalanceParameters): Promise<boolean|mappedTokenBalance[]> {
    try {
        const page = params.page;
        const C = params.C;
        let currentUrl: string = page!.url();

        let homeUrl: string = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html"
        ].join("")

        await page!.goto(homeUrl, { waitUntil: 'domcontentloaded' });
        await page!.waitForTimeout(1000);

        await page!.evaluate( async (options) => {
            const C = options['config'];
            let listPopup = [
                C.elements.modals.home,
                C.elements.modals.home_popover
            ];

            for(let list of listPopup) {
                let elements = document.querySelectorAll(list);
                if (elements.length >= 1) {
                    await elements[0].click();
                }
            }
        }, {'config': C});

        let isClickButtonAssets = await page!.evaluate( function (C) {
            
            return (document.querySelector(".tab--active") as Element).textContent == 'Assets' ? false : true;
        }, C);

        console.log("isClickButtonAssets: " + isClickButtonAssets);
        
        if (isClickButtonAssets == true) {
            await page!.waitForXPath(C.elements.get_balances.button_assets_xpath, { visible: true });
            const [buttonAssets]: any = await page!.$x(C.elements.get_balances.button_assets_xpath);
            await buttonAssets.click();
        }

        await page!.waitForSelector(C.elements.get_balances.div_token_sell , {
            timeout: 15000
        });

        let divTokens = await page!.evaluate(function (C) {
            let list = [];
            let divTokensRaw = document.querySelectorAll(C.elements.get_balances.div_token_sell);
            for (let i: number = 0; i < divTokensRaw.length; i++) {
                list.push((divTokensRaw[i] as HTMLElement).innerText);
            }
            return list;
        }, C);

        let mappedTokensWithBalance: mappedTokenBalance[];
        mappedTokensWithBalance = divTokens.map( function(token) {
            let splitted = token.split("\n");
            let mappedTokens: mappedTokenBalance;
            mappedTokens = {
                'balance': Number(splitted[0]),
                'slug': (splitted[1]).toLocaleLowerCase(),
                'token_raw': token,
            };

            return mappedTokens;
        });

        return mappedTokensWithBalance;
    } catch (error) {
        console.log(error)
    }

    return false;
}

export default getBalances