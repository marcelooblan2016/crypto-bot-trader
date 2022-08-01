import {Page} from 'puppeteer';
import swapHistory from '../../Records/swapHistory';
import logger from '../../Records/logger';
import tokenLibs from '../../Records/token';

interface addNewNetworkParameters {
    page: Page | null,
    C: any,
    networkName: string, 
    rpc: string,
    chainId: number  | null,
    symbol: string  | null,
    explorer: string | null,
}

async function addNewNetwork(params: addNewNetworkParameters): Promise<boolean> {
    /**
     *                 networkName: network.slug,
                rpc: network.rpc_url,
                chainId: network.chain_id,
                symbol: network.currency_symbol,
                explorer: network.block_explorer_url,
     */
    const page = params.page;
    const C = params.C;
    let currentUrl: string = page!.url();

    try {
        let networkUrl: string = [
            C.urls.prefix,
            currentUrl.match(/\/\/(.*?)\//i)![1],
            `/home.html#settings/networks`
        ].join("");
        await page!.goto(networkUrl, { waitUntil: 'domcontentloaded' });
        // click add new network
        await page!.waitForXPath(C.elements.add_new_network.button_add_a_network_xpath + "[not(@disabled)]", { visible: true });
        const [buttonAddNewNetwork]: any = await page!.$x(C.elements.add_new_network.button_add_a_network_xpath);
        await buttonAddNewNetwork.click();
        // Type Network Name
        const [inputNetworkNameXpath] = await page!.$x(C.elements.add_new_network.input_network_name_xpath);
        await inputNetworkNameXpath.type(params.networkName);
        // Type input rpc url
        const [inputRpcUrlXpath] = await page!.$x(C.elements.add_new_network.input_rpc_url_xpath);
        await inputRpcUrlXpath.type(params.rpc);
        // Type input chain id
        const [inputChainIdXpath] = await page!.$x(C.elements.add_new_network.input_chain_id_xpath);
        await inputChainIdXpath.type(String(params.chainId));
        // Type currency symbol
        const [inputCurrencySymbolXpath] = await page!.$x(C.elements.add_new_network.input_currency_symbol_xpath);
        await inputCurrencySymbolXpath.type(String(params.symbol));
        // Type Explorer
        const [inputExplorerXpath] = await page!.$x(C.elements.add_new_network.input_explorer_xpath);
        await inputExplorerXpath.type(String(params.explorer));
        await page!.waitForTimeout(2000);
        await page!.waitForXPath(C.elements.add_new_network.button_save_xpath + "[not(@disabled)]");
        const [buttonSaveXpath]: any = await page!.$x(C.elements.add_new_network.button_save_xpath);
        await buttonSaveXpath.click();

        return true;
    } catch (error) {
        console.log(error);
    }

    return false;
}

export default addNewNetwork