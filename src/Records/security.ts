import readlineSync from 'readline-sync';
import Cryptr from 'cryptr'
import logger from './logger';

const fs = require('fs');

class Security {
    protected keyFile: string = './keys';

    constructor(options? : any) {}

    public isKeyFileExists(): boolean
    {
        return fs.existsSync(this.keyFile);
    }

    public async setKey(): Promise<void>
    {
        let pKey: string = readlineSync.question('Private Key: ', {
            hideEchoBack: true,
            mask: '*'
        });

        let password: string = '';
        let confirmPassword: string = '';
        let isMatched: boolean = false;
        do {
            password = readlineSync.question('Password: ', {
                hideEchoBack: true,
                mask: '*'
            });
    
            confirmPassword = readlineSync.question('Confirm Password: ', {
                hideEchoBack: true,
                mask: '*'
            });
            
            if ( (password != '' || confirmPassword != '') && password == confirmPassword) {
                isMatched = true;
            }
            else {
                logger.write({content: "Password not match, please try again."});
            }
          }
          while ( isMatched === false );

        if(isMatched === true) {
            const cryptr = new Cryptr(password);
            logger.write({content: "Encrypting data..."});
            const encryptedString = cryptr.encrypt(pKey);
            fs.writeFileSync(this.keyFile, encryptedString);
        }
    }

    public async retrieveKey(): Promise<string|boolean>
    {
        try {
            let password: string = readlineSync.question('Password: ', {
                hideEchoBack: true,
                mask: '*'
            });

            const cryptr = new Cryptr(password);
            let encryptedString: string = await fs.readFileSync(this.keyFile, 'utf8');

            return cryptr.decrypt(encryptedString);

        } catch (error) {
            logger.write({content: "Invalid password, please try again."});
        }

        return false;
    }
}

export default new Security;