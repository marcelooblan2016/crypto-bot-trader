
async function delay(params: delayParameters): Promise<void> {
    try {
        const page = params.page;
        const C = params.C;
        let delay = params.delay;

        await page!.waitForTimeout(delay);
        
    } catch (error) {}
}

export default delay