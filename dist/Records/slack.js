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
const axios_1 = __importDefault(require("axios"));
class Slack {
    constructor(options) {
        this.webhook_url = constants_1.default.slack.webhook_url;
    }
    isSlackAvailable() {
        if (this.webhook_url == null) {
            return false;
        }
        return true;
    }
    send(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.isSlackAvailable() === false) {
                    throw "slack not available.";
                }
                const options = {
                    text: params.text
                };
                yield axios_1.default.post(this.webhook_url, JSON.stringify(options))
                    .then(function (response) {
                    return true;
                })
                    .catch(function (error) {
                    return false;
                });
                return true;
            }
            catch (error) { }
            return false;
        });
    }
}
exports.default = new Slack;
