"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
const envMigrations = require("./Records/Migrations/env");
const config = (() => {
    let fs = require('fs');
    try {
        let envFilePath = './.env';
        console.log("Env File: Loading...");
        if (!fs.existsSync(envFilePath)) {
            fs.appendFileSync(envFilePath, envMigrations.default.join("\n"));
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
    app_name: (_a = config.APP_NAME) !== null && _a !== void 0 ? _a : "crypto-bot-trader",
    urls: {
        "prefix": "chrome-extension://",
    },
    methods: {
        send_to: (_b = config.WALLET_ADDRESS) !== null && _b !== void 0 ? _b : null,
        base_amount: (_c = config.BASE_AMOUNT) !== null && _c !== void 0 ? _c : null,
    },
    metamask_version: 'v10.15.0',
    network_preferred: config.PREFERRED_NETWORK,
    headless_browser: Boolean(parseInt((_d = config.HEADLESS_BROWSER) !== null && _d !== void 0 ? _d : 0)),
    networks: [
        { "slug": "ropsten", "name": "Ropsten Test Network" },
        { "slug": "rinkeby", "name": "Rinkeby Test Network" },
        {
            "slug": "matic-mainnet",
            "name": "Matic Mainnet",
            "new": true,
            "rpc_url": "https://poly-rpc.gateway.pokt.network",
            "chain_id": 137,
            "currency_symbol": "MATIC",
            "block_explorer_url": "https://polygonscan.com/"
        }
    ],
    trading: {
        options: {
            sell_cutloss: parseInt((_e = config.SELL_CUTLOSS) !== null && _e !== void 0 ? _e : -10),
            sell_profit: parseInt((_f = config.SELL_PROFIT) !== null && _f !== void 0 ? _f : 5)
        }
    },
    elements: {
        home: {
            logo: ".app-header__logo-container"
        },
        modals: {
            home: ".pover-header__button",
            home_popover: ".popover-header__button",
        },
        switch_network: {
            div_network_display: ".network-display",
            div_dropdown_network_list: ".menu-droppo .dropdown-menu-item",
        },
        add_new_network: {
            button_add_a_network_xpath: "//button[contains(text(), 'Add a network')]",
            input_network_name_xpath: "//h6[contains(.,'Network Name')]/parent::node()/parent::node()/following-sibling::input",
            input_rpc_url_xpath: "//h6[contains(.,'New RPC URL')]/parent::node()/parent::node()/following-sibling::input",
            input_chain_id_xpath: "//h6[contains(.,'Chain ID')]/parent::node()/parent::node()/following-sibling::input",
            input_currency_symbol_xpath: "//h6[contains(.,'Currency Symbol')]/parent::node()/parent::node()/following-sibling::input",
            input_explorer_xpath: "//h6[contains(.,'Block Explorer URL')]/parent::node()/parent::node()/following-sibling::input",
            button_save_xpath: "//button[contains(text(), 'Save')]",
        },
        add_token: {
            button_search_and_add_token: "ul.page-container__tabs li button",
            button_custom_token_xpath: "//button[contains(text(), 'Custom Token')]",
            input_contract_address: "#custom-address",
            input_custom_symbol: "#custom-symbol",
            input_custom_decimals: "#custom-decimals",
            button_next_xpath: "//button[contains(text(), 'Next')]",
            button_add_token_xpath: "//button[contains(text(), 'Add Custom Token')]",
            button_import_tokens_xpath: "//button[contains(text(), 'Import Tokens')]",
        },
        swap_token: {
            div_max_button: ".build-quote__max-button",
            div_dropdown_search_list_pair: ".dropdown-input-pair .dropdown-search-list",
            input_dropdown_input_pair: ".dropdown-input-pair input[placeholder=\"Search for a token\"]",
            label_dropdown_option_pair: ".dropdown-input-pair .searchable-item-list__labels .searchable-item-list__primary-label",
            input_amount_pair: ".dropdown-input-pair input.MuiInputBase-input",
            div_dropdown_search_list_pair_to: ".dropdown-input-pair.dropdown-input-pair__to .dropdown-search-list",
            input_dropdown_input_pair_to: ".dropdown-input-pair.dropdown-input-pair__to input[placeholder=\"Search for a token\"]",
            label_dropdown_option_pair_to: ".dropdown-input-pair.dropdown-input-pair__to .searchable-item-list__labels .searchable-item-list__primary-label",
            button_swap_continue: ".actionable-message__action.actionable-message__action--primary",
            button_swap_review_xpath: "//button[contains(text(), 'Review Swap')]",
            div_warning: ".view-quote__price-difference-warning-contents-actions",
            button_swap_warning_xpath: "//button[contains(text(), 'I understand')]",
            button_swap_overview_xpath: "//button[contains(.,'Swap')]",
            button_swap_xpath: "//button[contains(text(),'Swap')]",
            div_transaction_complete_xpath: "//div[contains(text(), 'Transaction complete')]",
            button_close_xpath: "//button[contains(text(), 'Close')]",
            button_swap_cancel_xpath: "//div[contains(text(), 'Cancel')]",
        },
        send_to: {
            input_wallet_address_xpath: "//*[@placeholder='Search, public address (0x), or ENS']",
            div_dropdown_input_wrapper: ".send-v2__asset-dropdown__input-wrapper",
            div_token_list_item: ".token-list-item .token-list-item__data",
            input_amount: ".send-v2__form-field input.unit-input__input",
            button_next_xpath: "//button[contains(text(),'Next')]",
            button_confirm_xpath: "//button[contains(text(),'Confirm')]",
        },
        get_balances: {
            button_assets_xpath: "//button[contains(text(), 'Assets')]",
            div_token_sell: ".list-item.asset-list-item.token-cell",
            div_primary_balance: ".currency-display-component.token-overview__primary-balance"
        }
    },
    mailer: {
        host: (_g = config.MAIL_HOST) !== null && _g !== void 0 ? _g : null,
        port: (_h = config.MAIL_PORT) !== null && _h !== void 0 ? _h : null,
        secure: (function () {
            var _a;
            let mailPort = (_a = config.MAIL_PORT) !== null && _a !== void 0 ? _a : null;
            if (mailPort != null) {
                return Number(config.MAIL_PORT) == 465 ? true : false;
            }
            return false;
        })(),
        auth: {
            user: (_j = config.MAIL_USERNAME) !== null && _j !== void 0 ? _j : null,
            pass: (_k = config.MAIL_PASSWORD) !== null && _k !== void 0 ? _k : null
        },
        to: (_l = config.MAIL_TO) !== null && _l !== void 0 ? _l : null,
        from: (_m = config.MAIL_FROM) !== null && _m !== void 0 ? _m : null
    },
    slack: {
        webhook_url: (_o = config.WEBHOOK_URL) !== null && _o !== void 0 ? _o : null
    }
};
