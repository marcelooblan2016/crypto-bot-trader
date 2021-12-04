const metaMask = require('./Metamask/Metamask.js');

async function main() {
    //todo Environment (env)
    const newMetaMask = new metaMask();
    // initiate 
    await newMetaMask.build();
    process.exit(0);
    // initiate metamask
    const browser = await dappeteer.launch(puppeteer, { metamaskVersion: 'v10.1.1' });
    const metamask = await dappeteer.setupMetamask(browser);
    // restore wallet with private key
    await metamask.importPK("477bf47adb2af293a4a203d1ad8e92e215c5c95dd70ad91b44d4570661355736");
    // await metamask.switchNetwork('ropsten');
    await metamask.switchNetwork('rinkeby');

    // // you can change the network if you want

    const page = await metamask.page
    // const sendButton = await page.$('.wallet-overview__buttons button:eq(1)');
    const [sendButton] = await page.$x("//button[contains(., 'Send')]");
    if (sendButton) {
        await sendButton.click();
        //0x001a6aD4caE4C24Ca660206e094A2c3963F323D4
        await page.type('input[placeholder="Search, public address (0x), or ENS"', '0x001a6aD4caE4C24Ca660206e094A2c3963F323D4');
    }

    // // you can import a token
    // await metamask.addToken('0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa');
  
    // // go to a dapp and do something that prompts MetaMask to confirm a transaction
    // // const page = await browser.newPage();
    // // await page.goto('http://my-dapp.com');
    // // const payButton = await page.$('#pay-with-eth');
    // // await payButton.click();
  
    // // // 🏌
    // // await metamask.confirmTransaction();
  }
  
  main();