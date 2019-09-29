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
const path_1 = __importDefault(require("path"));
const fs = require("fs");
exports.fsPromise = (method, ...args) => new Promise((resolve, reject) => {
    fs[method].call(fs, ...args, (err, result) => {
        if (err)
            return reject(err);
        resolve(result);
    });
});
exports._readDir = (pathUri, relativePath, listReadFile) => __awaiter(void 0, void 0, void 0, function* () {
    const statActive = yield exports.fsPromise("stat", pathUri);
    let readFileRef;
    let fileName = pathUri.match(/[^/\^\\]*$/g)[0];
    if (statActive.isFile()) {
        readFileRef = {
            "type": "file",
            "filePath": pathUri,
            "parentDirPath": relativePath,
            fileName
        };
        listReadFile.push(readFileRef);
    }
    else if (statActive.isDirectory()) {
        readFileRef = {
            fileName,
            "type": "dir",
            "filePath": pathUri,
        };
        listReadFile.push(readFileRef);
        const list = yield exports.fsPromise("readdir", pathUri);
        for (let name of list) {
            yield exports._readDir(path_1.default.resolve(pathUri, name), relativePath ? relativePath + "/" + fileName : fileName, listReadFile);
        }
    }
});
exports.readDir = (pathUri) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        pathUri = path_1.default.resolve(pathUri);
        const list = [];
        yield exports._readDir(pathUri, "", list);
        return list;
    }
    catch (e) {
        console.log(e);
    }
});
exports.mkdir = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.fsPromise("mkdir", dir);
    }
    catch (e) {
        console.log(e);
    }
});
exports.perfectMkdir = (dir, mklist = [], main = true) => {
    if (fs.existsSync(dir))
        return false;
    mklist.push(dir);
    exports.perfectMkdir(path_1.default.dirname(dir), mklist, false);
    if (main) {
        for (let i of mklist.reverse()) {
            fs.mkdirSync(i);
        }
    }
    return true;
};
exports.checkFileAndMkdir = (filePath) => exports.perfectMkdir(path_1.default.dirname(filePath));
