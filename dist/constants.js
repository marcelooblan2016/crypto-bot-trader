"use strict";
const config = (() => {
    let fs = require('fs');
    try {
        let envFilePath = './.env';
        console.log("Env File: Loading...");
        if (!fs.existsSync(envFilePath)) {
            throw new Error('Env missing.');
        }
        console.log("Env File: Loaded.");
        let rawData = fs.readFileSync(envFilePath, 'utf8');
        let envValues = {};
        let data = rawData.split("\n")
            .filter(function (rowStr) {
            return rowStr.includes('=') && !rowStr.includes('#');
        })
            .map(function (rawValue) {
            let row = rawValue.split("=");
            let value = row[1].split('"').join('');
            envValues[row[0]] = value;
        });
        return envValues;
    }
    catch (e) {
        console.log(e);
        process.exit(0);
    }
})();
module.exports = {
    urls: {
        "prefix": "chrome-extension://",
    },
    metamask_version: 'v10.1.1',
    private_key: config.PRIVATE_KEY,
    network_preferred: config.PREFERRED_NETWORK,
    networks: [
        { "slug": "ropsten", "name": "Ropsten Test Network" },
        { "slug": "rinkeby", "name": "Rinkeby Test Network" },
        {
            "slug": "matic-mainnet",
            "name": "Matic Mainnet",
            "new": true,
            "rpc_url": "https://rpc-mainnet.maticvigil.com",
            "chain_id": 137,
            "currency_symbol": "MATIC",
            "block_explorer_url": "https://explorer.matic.network"
        }
    ],
    elements: {
        add_token: {
            input_contract_address: "#custom-address",
            input_custom_symbol: "#custom-symbol",
            input_custom_decimals: "#custom-decimals",
            button_next_xpath: "//button[contains(., 'Next')]",
            button_add_token_xpath: "//button[contains(., 'Add Tokens')]"
        },
        swap_token: {
            div_dropdown_search_list_pair: ".dropdown-input-pair .dropdown-search-list",
            input_dropdown_input_pair: ".dropdown-input-pair input[placeholder=\"Search for a token\"]",
            label_dropdown_option_pair: ".dropdown-input-pair .searchable-item-list__labels .searchable-item-list__primary-label",
            input_amount_pair: ".dropdown-input-pair input.MuiInputBase-input",
            div_dropdown_search_list_pair_to: ".dropdown-input-pair.dropdown-input-pair__to .dropdown-search-list",
            input_dropdown_input_pair_to: ".dropdown-input-pair.dropdown-input-pair__to input[placeholder=\"Search for a token\"]",
            label_dropdown_option_pair_to: ".dropdown-input-pair.dropdown-input-pair__to .searchable-item-list__labels .searchable-item-list__primary-label",
            button_swap_review_xpath: "//button[contains(., 'Review Swap')]",
            button_swap_xpath: "//button[contains(text(),'Swap')]",
            div_transaction_complete_xpath: "//div[contains(text(), 'Transaction complete')]",
            button_close_xpath: "//button[contains(text(), 'Close')]"
        }
    }
};
