#!/usr/bin/env node
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
const commander_1 = __importDefault(require("commander"));
const setting_1 = require("./setting");
const index_1 = require("./index");
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const result = commander_1.default
    .version(setting_1.VERSION)
    .option("-x,--excute", "uncompress")
    .option("-c,--create", "compress")
    .parse(process.argv);
let [a, b] = result.args;
if (!a || !b) {
    console.error(chalk_1.default.red `Be short of arguments`);
    process.exit();
}
const current_path = process.cwd();
a = path_1.default.resolve(current_path, a);
b = path_1.default.resolve(current_path, b);
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (result.excute) {
            yield index_1.unzip(a, b, (filePath) => console.log(chalk_1.default.gray("unzip: "), filePath));
            console.info(chalk_1.default.cyan `uncompress complete~`);
        }
        else if (result.create) {
            yield index_1.zip(a, b, (filePath) => console.log(chalk_1.default.gray("zip: "), filePath));
            console.log(chalk_1.default.cyan `compress complete~`);
        }
    }
    catch (e) {
        console.log(e);
    }
});
run();
