
import tokenContractsMigrations from '../Migrations/tokenContracts';

function tokenContracts (): tokenContractInterface[] {

    let fileName: string = 'tokenContracts.json';
    let jsonContractPath: string = `./${fileName}`;

    const fs = require('fs');
    if (!fs.existsSync(jsonContractPath)) {
        fs.appendFileSync(jsonContractPath, JSON.stringify(tokenContractsMigrations));
    }

    let rawData: string = fs.readFileSync(jsonContractPath);

    return (JSON.parse(rawData)) as tokenContractInterface[];
}

export default tokenContracts