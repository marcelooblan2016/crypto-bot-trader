const {metaMask} = require('../dist/index');
const _ = require('lodash');

(async function() {
    await metaMask.build();
    await metaMask.clearPopups();

    let balances = await metaMask.getBalances();
    let tokenSlug = 'usdc';
    let tokenBalance = balances.filter( function (token) {
        return token.slug == tokenSlug;
    })[0] ?? null;
    console.log(tokenBalance.balance);

})();