const config = (() => {
    let fs = require('fs');
    try {
        let envFilePath = './.env';
        console.log("Env File: Loading...");

        if (!fs.existsSync(envFilePath)) {
            throw new Error('Env missing.')
        }

        console.log("Env File: Loaded.");

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
    base_url: "chrome-extension://47b67bf5-2a2f-4e90-8d13-3628d0ff2ab9/home.html",
    metamask_version: 'v10.1.1',
    private_key: config.PRIVATE_KEY,
    network_preferred: config.PREFERRED_NETWORK,
    networks: [
        {"slug": "ropsten", "name": "Ropsten Test Network"},
        {"slug": "rinkeby", "name": "Rinkeby Test Network"},
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
};
