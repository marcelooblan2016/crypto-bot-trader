import {Page} from 'puppeteer';
import logger from '../../Records/logger';
interface switchNetworkParameters {
    page: Page | null, 
    network: string,
    C: any
}

async function switchNetwork(params: switchNetworkParameters): Promise<boolean> {
    
    const page = params.page;
    const C = params.C;
    const networkPreferred: string = params.network;

    try {
        logger.write({content: "Switch network: in_process"});
        await page!.click(C.elements.switch_network.div_network_display);
        
        await page!.evaluate((options) => {
            const C = options['config'];
            let network = options['network'];
            let networkSlugged = (network).toLowerCase().replaceAll(" ", "-");
            [...document.querySelectorAll(C.elements.switch_network.div_dropdown_network_list)].find(element => {
                return element.textContent.toLowerCase() === network || element.textContent.toLowerCase() === networkSlugged
            }).click();

        }, {
            'network': networkPreferred,
            'config': C
        });

        logger.write({content: "Switch network: success"});
        return true;
    } catch (error) {
        console.log(error);
        logger.write({content: "Switch network: failed"});
        logger.screenshot(page!);
    }

    return false;
}

export default switchNetwork