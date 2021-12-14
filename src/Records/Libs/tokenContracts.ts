
function tokenContracts (): tokenContractInterface[] {
    let jsonContractPath: string = '../tokenContracts.json';

    const fs = require('fs');
    let rawData: string = fs.readFileSync(jsonContractPath);

    return (JSON.parse(rawData)) as tokenContractInterface[];
}

export default tokenContracts