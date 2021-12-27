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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
class Logger {
    constructor(options) {
        this.directory = './logs';
        if (!fs.existsSync(this.directory)) {
            fs.mkdirSync(this.directory);
        }
    }
    getName(type) {
        const d = new Date();
        let month = d.getMonth() + 1;
        return type == 1 ? `${d.getFullYear()}-${month}-${d.getDate()}` :
            `${d.getFullYear()}-${month}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}`;
    }
    write(params) {
        const d = new Date();
        let month = d.getMonth() + 1;
        let dateString = this.getName(1);
        let dateTimeString = `${d.getFullYear()}-${month}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        let fileName = `${this.directory}/${dateString}.log`;
        let content = `${dateTimeString}: ${params.content}` + "\n";
        this.console(content);
        fs.appendFileSync(fileName, content);
        return true;
    }
    screenshot(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let pathFileName = `${this.directory}/${this.getName(2)}.png`;
            yield page.screenshot({ path: pathFileName });
            return true;
        });
    }
    console(content) {
        console.log(content);
    }
}
exports.default = new Logger;
