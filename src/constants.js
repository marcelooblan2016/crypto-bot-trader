const envMigrations = require("./Records/Migrations/env");

const config = (() => {

    let fs = require('fs');
    try {
        let envFilePath = './.env';

        if (!fs.existsSync(envFilePath)) {
            fs.appendFileSync(envFilePath, envMigrations.default.join("\n"));
        }

        let rawData = fs.readFileSync(envFilePath, 'utf8');
        let envValues = {};
        let data = rawData.split("\n")
        .filter( function (rowStr) {

            return rowStr.includes('=') && !rowStr.includes('#');
        })
        .map( function (rawValue) {
            let row = rawValue.split("=");
            let value = row[1].split('"').join('');
            envValues[row[0]] = value;
        });

        return envValues;
    } catch(e) {
        console.log(e);
        process.exit(0);
    }

})();

module.exports = {
    app_name: config.APP_NAME ?? "crypto-bot-trader",
    urls: {
        "prefix": "chrome-extension://",
    },
    methods: {
        send_to: config.WALLET_ADDRESS ?? null,
        base_amount: config.BASE_AMOUNT ?? null,
    },
    metamask_version: 'v10.15.0',
    network_preferred: config.PREFERRED_NETWORK,
    headless_browser: Boolean( parseInt(config.HEADLESS_BROWSER ?? 0) ),
    networks: [
        {"slug": "ropsten", "name": "Ropsten Test Network"},
        {"slug": "rinkeby", "name": "Rinkeby Test Network"},
        {
            "slug": "matic-mainnet",
            "name": "Matic Mainnet",
            "new": true,
            "rpc_url": config.NETWORK_RPC_URL ?? "https://polygon-rpc.com",
            "chain_id": 137,
            "currency_symbol": "MATIC",
            "block_explorer_url": "https://polygonscan.com/"
        }
    ],
    trading: {
        options: {
            sell_cutloss: parseInt(config.SELL_CUTLOSS ?? -10),
            sell_profit: parseInt(config.SELL_PROFIT ?? 5)
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
        host: config.MAIL_HOST ?? null,
        port: config.MAIL_PORT ?? null,
        secure: (function () {
            let mailPort = config.MAIL_PORT ?? null;
            if (mailPort != null) {
                return Number(config.MAIL_PORT) == 465 ? true : false
            }

            return false;
        })(),
        auth: {
          user: config.MAIL_USERNAME ?? null,
          pass: config.MAIL_PASSWORD ?? null
        },
        to: config.MAIL_TO ?? null,
        from: config.MAIL_FROM ?? null
    },
    slack: {
        webhook_url: config.WEBHOOK_URL ?? null
    }
};