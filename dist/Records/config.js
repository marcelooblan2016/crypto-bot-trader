"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class config {
    constructor(options) {
        this.envFile = './.env';
    }
    isEnvExist() {
        if (fs_1.default.existsSync(this.envFile)) {
            return true;
        }
        return false;
    }
    envValues() {
        let envValues = {};
        let envContent = fs_1.default.readFileSync(this.envFile, 'utf8');
        let data = envContent.split("\n")
            .filter(function (rowStr) {
            return rowStr.includes('=') && !rowStr.includes('#');
        })
            .map(function (rawValue) {
            let row = rawValue.split("=");
            let value = row[1].split('"').join('');
            envValues[row[0]] = value;
        });
        return envValues;
    }
    update(params) {
        if (this.isEnvExist() === false) {
            return false;
        }
        let envValues = this.envValues();
        envValues[params.key] = params.value;
        let envContent = "";
        for (let key in envValues) {
            envContent += [key, '=', envValues[key], "\n"].join("");
        }
        fs_1.default.writeFileSync(this.envFile, envContent, {});
        return true;
    }
}
exports.default = new config;
