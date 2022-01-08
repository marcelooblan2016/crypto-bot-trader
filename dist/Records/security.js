"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const cryptr_1 = __importDefault(require("cryptr"));
const logger_1 = __importDefault(require("./logger"));
const constants_1 = __importDefault(require("../constants"));
const fs = require('fs');
class Security {
    constructor(options) {
        this.keyFile = './keys';
        this.pwdTmp = './p.tmp';
        this.defaultKey = null;
        this.defaultKey = constants_1.default.network_preferred;
    }
    isKeyFileExists() {
        return fs.existsSync(this.keyFile);
    }
    isPwdTmpExists() {
        return fs.existsSync(this.pwdTmp);
    }
    setKey() {
        return __awaiter(this, void 0, void 0, function* () {
            let pKey = readline_sync_1.default.question('Private Key: ', {
                hideEchoBack: true,
                mask: '*'
            });
            let password = '';
            let confirmPassword = '';
            let isMatched = false;
            do {
                password = readline_sync_1.default.question('New Password: ', {
                    hideEchoBack: true,
                    mask: '*'
                });
                confirmPassword = readline_sync_1.default.question('Confirm Password: ', {
                    hideEchoBack: true,
                    mask: '*'
                });
                if ((password != '' || confirmPassword != '') && password == confirmPassword) {
                    isMatched = true;
                }
                else {
                    logger_1.default.write({ content: "Password not match, please try again." });
                }
            } while (isMatched === false);
            if (isMatched === true) {
                const cryptr = new cryptr_1.default(password);
                logger_1.default.write({ content: "Encrypting data..." });
                const encryptedString = cryptr.encrypt(pKey);
                fs.writeFileSync(this.keyFile, encryptedString);
            }
        });
    }
    retrieveKey(pwd, is_setup) {
        return __awaiter(this, void 0, void 0, function* () {
            let isPwd = Boolean(pwd);
            const pwdCrypt = new cryptr_1.default(this.defaultKey);
            try {
                let password = null;
                if (isPwd === false) {
                    password = readline_sync_1.default.question('Password: ', {
                        hideEchoBack: true,
                        mask: '*'
                    });
                }
                let encryptedPwdString = null;
                if (is_setup === true) {
                    let encryptedPwdString = pwdCrypt.encrypt(password);
                    yield fs.writeFileSync(this.pwdTmp, encryptedPwdString);
                }
                if (isPwd === true) {
                    if (this.isPwdTmpExists() == true) {
                        encryptedPwdString = yield fs.readFileSync(this.pwdTmp, 'utf8');
                        password = pwdCrypt.decrypt(encryptedPwdString);
                        // delete file
                        yield fs.unlinkSync(this.pwdTmp);
                    }
                }
                const cryptr = new cryptr_1.default(password);
                let encryptedString = yield fs.readFileSync(this.keyFile, 'utf8');
                return cryptr.decrypt(encryptedString);
            }
            catch (error) {
                logger_1.default.write({ content: "Invalid password, please try again." });
            }
            return false;
        });
    }
}
exports.default = new Security;
