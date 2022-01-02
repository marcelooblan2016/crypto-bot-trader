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
const logger_1 = __importDefault(require("../../Records/logger"));
function switchNetwork(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = params.page;
        const C = params.C;
        const networkPreferred = params.network;
        try {
            logger_1.default.write({ content: "Switch network: in_process" });
            yield page.click(C.elements.switch_network.div_network_display);
            yield page.evaluate((options) => {
                const C = options['config'];
                let network = options['network'];
                let networkSlugged = (network).toLowerCase().replaceAll(" ", "-");
                [...document.querySelectorAll(C.elements.switch_network.div_dropdown_network_list)].find(element => {
                    return element.textContent.toLowerCase() === network || element.textContent.toLowerCase() === networkSlugged;
                }).click();
            }, {
                'network': networkPreferred,
                'config': C
            });
            logger_1.default.write({ content: "Switch network: success" });
            return true;
        }
        catch (error) {
            console.log(error);
            logger_1.default.write({ content: "Switch network: failed" });
            logger_1.default.screenshot(page);
        }
        return false;
    });
}
exports.default = switchNetwork;
