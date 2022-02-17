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
const constants_1 = __importDefault(require("../constants"));
const nodemailer_1 = __importDefault(require("nodemailer"));
class Mailer {
    constructor(options) {
        this.transporter = nodemailer_1.default.createTransport({
            host: constants_1.default.mailer.host,
            port: constants_1.default.mailer.port,
            secure: constants_1.default.mailer.secure,
            auth: {
                user: constants_1.default.mailer.auth.user,
                pass: constants_1.default.mailer.auth.pass,
            },
        });
    }
    send(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (constants_1.default.mailer.auth.user == null || constants_1.default.mailer.auth.pass == null) {
                    throw "mail set up not ready.";
                }
                let info = yield this.transporter.sendMail({
                    from: constants_1.default.mailer.from,
                    to: constants_1.default.mailer.to,
                    subject: params.subject,
                    text: params.message, // plain text body
                });
                console.log("Message sent: %s", info.messageId);
                return true;
            }
            catch (error) { }
            return false;
        });
    }
}
exports.default = new Mailer;
