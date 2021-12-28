# CryptoCurrency Bot Trader 
swapping of [ERC-20 Tokens][erc20] (buy/sell) based on the market health with bot strategy (condition) - by utilizing MetaMask &amp; Puppeteer

## Installation

```bash
npm i crypto-bot-trader
```
## Usage
Filename as .env in {root}
```bash
PRIVATE_KEY="{Wallet privateKey}"
PREFERRED_NETWORK="matic-mainnet"
# Default: 0
HEADLESS_BROWSER=1
# Sell Options
# Default: -10 (percent as unit)
SELL_CUTLOSS=-5
# Default: 5 (percent as unit)
SELL_PROFIT=1
```

Filename as {jsFile} in {root}

```js
const {metaMask, trader, token} = require('crypto-bot-trader');

(async function() {
    // // initiate 
    await metaMask.build();
    const initiatedTrader = new trader({metamask_with_build: metaMask, token: token});
    
    await initiatedTrader.analyzeMarket()
    setInterval(async () => {
        await initiatedTrader.analyzeMarket()
    }, 300000);
    // every 5 minutes

})();
```

```bash
node {jsFile}
```


[erc20]: https://etherscan.io/tokens
