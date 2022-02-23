const tokenContracts = require('../dist/Records/Migrations/tokenContracts').default;
const swapHistory = require('./swapHistory.json');
const fs = require('fs');

(async function () {
    let currentTokensFromHistory = swapHistory.map(token => token.slug);
    let isNewToken = false;
    for(let contract of tokenContracts) {
        if (!currentTokensFromHistory.includes(contract.slug)) {
            swapHistory.push({
                "slug": contract.slug,
                "current_price": 0,
                "amount_acquired": 0,
                "amount_from": 0
            });
            console.log(`${contract.name} >> ${contract.slug} token added.`);
            isNewToken = true;
        }
    }
    
    if (isNewToken == true) {
        fs.writeFileSync('./swapHistory.json', JSON.stringify(swapHistory));
    }

})();