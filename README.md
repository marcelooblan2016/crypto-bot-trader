# CryptoCurrency Bot Trader
swapping of [ERC-20 Tokens][erc20] (buy/sell) based on the market health with bot strategy (condition) - by utilizing MetaMask &amp; Puppeteer

## List of ERC-20 Tokens Included
- ChainLink Token, Decentraland, Uniswap, Graph Token, Aave, Basic Authentication Token (BAT), Curve (CRV), Sushi Token, Sand, Avalanche, Wrapped Matic
- [Full Details][erc20List] 
## Compatible Networks
- Polygon

## Important token/coin
- usdc (for trading)
- matic (for gas fees)

## Notes
- Always make sure to have a balance in usdc (used for trading) & matic (for gas fees)
- One trade at a time (for now)
- Compound trading

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

## Extras
You can also stop your trading bot on a certain date; This is quite ideal on cloud server <Which im currently working-on>

On Env File: Add the following key
```bash
CHECKPOINT_DATE="{YOUR_DATE_HERE-> Format: MMMM-Do-YYYY h:mm:ss a}"
```


[erc20]: https://etherscan.io/tokens
[erc20List]: https://github.com/marcelooblan2016/crypto-bot-trader/blob/main/src/Records/Migrations/tokenContracts.js

