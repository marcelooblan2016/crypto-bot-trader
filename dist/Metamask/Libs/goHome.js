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
function goHome(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = params.page;
            const C = params.C;
            let currentUrl = page.url();
            let homeUrl = [
                C.urls.prefix,
                currentUrl.match(/\/\/(.*?)\//i)[1],
                "/home.html"
            ].join("");
            yield page.goto(homeUrl, { waitUntil: 'domcontentloaded' });
            yield page.waitForTimeout(1000);
        }
        catch (error) { }
    });
}
exports.default = goHome;
