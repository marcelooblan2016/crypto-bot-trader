import {Page} from 'puppeteer';

interface getBalanceParameters {
    page: Page | null,
    token_slug?: string,
    C: any
}

async function getBalances(params: getBalanceParameters): Promise<object|boolean> {
    try {
        const page = params.page;
        const C = params.C;
        let currentUrl: string;
        currentUrl = page!.url();

        let homeUrl: string;
        homeUrl = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html"
        ].join("")

        await page!.goto(homeUrl);
        await page!.waitForTimeout(1000);
        
        await page!.waitForSelector('.list-item.asset-list-item.token-cell' , {
            timeout: 15000
        });

        let divTokens = await page!.evaluate(function () {
                let list = [];
                let divTokensRaw = document.querySelectorAll('.list-item.asset-list-item.token-cell');
                let i: number;
                for (i = 0; i < divTokensRaw.length; i++) {
                    list.push((divTokensRaw[i] as HTMLElement).innerText);
                }
                return list;
         });

         let mappedTokensWithBalance = divTokens.map( function(token) {
            let splitted = token.split("\n");

            return {
                'balance': parseFloat(splitted[0]),
                'slug': (splitted[1]).toLocaleLowerCase(),
                'token_raw': token,
            };
        });

        return mappedTokensWithBalance;
    } catch (error) {
        console.log(error)
    }

    return false;
}

export default getBalances