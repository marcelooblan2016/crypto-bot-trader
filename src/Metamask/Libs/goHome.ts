
async function goHome(params: goHomeParameters): Promise<void> {
    try {
        const page = params.page;
        const C = params.C;
        let currentUrl: string = page!.url();

        let homeUrl: string = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            "/home.html"
        ].join("");

        await page!.goto(homeUrl, { waitUntil: 'domcontentloaded' });
        await page!.waitForTimeout(1000);
        
    } catch (error) {}
}

export default goHome