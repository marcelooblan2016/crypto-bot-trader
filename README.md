# CryptoCurrency Bot Trader
swapping of [ERC-20 Tokens][erc20] (buy/sell) based on the market health with bot strategy (condition) - by utilizing MetaMask &amp; Puppeteer

![image](https://drive.google.com/uc?export=view&id=1IzFTRLwAVSPK3j1h2AkwkqbOBOq6VzeC)

## List of ERC-20 Tokens Included
- ChainLink Token, Decentraland, Uniswap, Aave, Curve (CRV), Sushi Token, Avalanche, Wrapped Matic, Wrapped BTC
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
PREFERRED_NETWORK="matic-mainnet"
# Default: 0
HEADLESS_BROWSER=1
# Sell Options
# Default: -10 (percent as unit)
SELL_CUTLOSS=-5
# Default: 5 (percent as unit)
SELL_PROFIT=1
```

## Security
As for initial setup will require you to input your PrivateKey & password (required upon encryption of your data)
![image](https://drive.google.com/uc?export=view&id=1a7fPmue1yNcsjbS9_pQvgAUBIpifCTkW)

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
CHECKPOINT_DATE="{YOUR_DATE_HERE-> Format: YYYY-MM-DD HH:mm} (24-hour)"
```

## Headless
Typical headless in puppeteer with extension of metamask will not work. Alternatively, you can use X Virtual Frame Buffer (xvfb) [See Details][npmforever] 

```js
const {metaMask, trader, token} = require('crypto-bot-trader');
const Xvfb = require('xvfb');

(async function() {
    let xvfb = new Xvfb();
    xvfb.startSync();
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

## Deploy in cloud server
Setup in cloud server, A simple CLI tool for ensuring that a given script runs continuously/in-background called (forever) [See Details][npmforever] 

```js
const {metaMask, trader, token} = require('crypto-bot-trader');
const { exec } = require("child_process");

(async function() {
    await metaMask.initializeSecurity({pwd: null, is_setup: true});
    exec(`forever start headless.js --pwd=1`, (error, stdout, stderr) => {});

})();
```

## Focus Feature
Focus on a specific token, this is good especially if the volatility of token is really high.
- focus on matic? wmatic
- focus on bitcoin? wbtc
- foucus on etherium? weth

```bash
node {jsFile} --focus=wmatic
```

[erc20]: https://etherscan.io/tokens
[erc20List]: https://github.com/marcelooblan2016/crypto-bot-trader/blob/main/src/Records/Migrations/tokenContracts.js
[npmforever]: https://www.npmjs.com/package/forever
[npmxvfb]: https://www.npmjs.com/package/xvfb

## Method: 'sendto'
After a successful trade, profit will be sent to a specific wallet address.
This feature is good if you have bunch of bot traders & you want the profit to be centralized.
```bash
node {jsFile} --focus=wmatic --method=sendto
```
In .env in {root}
```bash
WALLET_ADDRESS=
# Exact amount that will be the baseline of trader to prevent draining of wallet; (USDC Currency)
# Ex: 200
BASE_AMOUNT=
```