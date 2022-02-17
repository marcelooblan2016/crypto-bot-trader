import readlineSync from 'readline-sync';
import Cryptr from 'cryptr'
import logger from './logger';
import C from '../constants'

const fs = require('fs');

class Security {
    protected keyFile: string = './keys';
    protected pwdTmp: string = './p.tmp';

    private defaultKey = null; 

    constructor(options? : any) {
        this.defaultKey = C.network_preferred;
    }

    public isKeyFileExists(): boolean
    {
        return fs.existsSync(this.keyFile);
    }

    public isPwdTmpExists(): boolean
    {
        return fs.existsSync(this.pwdTmp);
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
            password = readlineSync.question('New Password: ', {
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

    public async retrieveKey(pwd: string | null, is_setup?: boolean): Promise<string|boolean>
    {
        let isPwd: boolean = Boolean(pwd);
        
        const pwdCrypt = new Cryptr(this.defaultKey);
        try {
            let password: string | null = null;
            
            if (isPwd === false) {
                password = readlineSync.question('Password: ', {
                    hideEchoBack: true,
                    mask: '*'
                });
            }

            let encryptedPwdString: string | null = null;
            if (is_setup === true) {
                let encryptedPwdString = pwdCrypt.encrypt(password);
                await fs.writeFileSync(this.pwdTmp, encryptedPwdString);
            }
            
            if (isPwd === true) {
                if (this.isPwdTmpExists() == true) {
                    encryptedPwdString = await fs.readFileSync(this.pwdTmp, 'utf8');
                    password = pwdCrypt.decrypt(encryptedPwdString);
                    // delete file
                    await fs.unlinkSync(this.pwdTmp);
                }
            }
            
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