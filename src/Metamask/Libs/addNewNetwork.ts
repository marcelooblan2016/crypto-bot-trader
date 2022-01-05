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
        await page!.waitForTimeout(2000);
        await page!.click(C.elements.switch_network.div_network_display);

        await page!.evaluate((options) => {
            const C = options['config'];
            let network = options['network'];
            
            [...document.querySelectorAll(C.elements.switch_network.div_dropdown_network_list)].find(element => (new RegExp(network)).test(element.textContent) ).click();
        }, {
            'network': "Custom RPC",
            'config': C
        });
        
        // Network Name
        await page!.waitForSelector(C.elements.add_new_network.input_network_name , {timeout: 15000});
        await page!.type(C.elements.add_new_network.input_network_name , params.networkName);
        // RPC URL
        await page!.waitForSelector(C.elements.add_new_network.input_rpc_url , {timeout: 15000});
        await page!.type(C.elements.add_new_network.input_rpc_url , params.rpc);
        // Chain ID
        if (params.chainId != null) {
            await page!.waitForSelector(C.elements.add_new_network.input_chain_id , {timeout: 15000});
            await page!.type(C.elements.add_new_network.input_chain_id , (params.chainId).toString());
        }
        // Currency Symbol
        if (params.symbol != null) {
            await page!.waitForSelector(C.elements.add_new_network.input_currency_symbol , {timeout: 15000});
            await page!.type(C.elements.add_new_network.input_currency_symbol , (params.symbol).toString());
        }
        // BlockChain Url
        if (params.explorer !=  null) {
            await page!.waitForSelector(C.elements.add_new_network.input_block_explorer_url , {timeout: 15000});
            await page!.type(C.elements.add_new_network.input_block_explorer_url , (params.explorer).toString());
        }

        await page!.waitForXPath(C.elements.add_new_network.button_save_xpath + "[not(@disabled)]", { visible: true });
        const [buttonSave] = await page!.$x(C.elements.add_new_network.button_save_xpath);
        await buttonSave.click();
        await page!.waitForTimeout(2000);
        await page!.click(C.elements.add_new_network.div_close_button);

        return true;
    } catch (error) {
        console.log(error);
    }

    return false;
}

export default addNewNetwork