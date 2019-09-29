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
const fs_1 = require("./fs");
const path_1 = __importDefault(require("path"));
const fs_2 = __importDefault(require("fs"));
const jszip = require("jszip");
exports.zipFolder = (inputDir, targetFilePath, runtime) => __awaiter(void 0, void 0, void 0, function* () {
    targetFilePath = path_1.default.resolve(targetFilePath);
    const list = yield fs_1.readDir(inputDir);
    const folderName = path_1.default.basename(inputDir);
    const dict = new Map();
    const zip = new jszip();
    for (let readFile of list) {
        if (readFile.type == "dir" || readFile.fileName == folderName)
            continue;
        if (readFile.type == "file") {
            let readFileParentDir = readFile.parentDirPath;
            readFileParentDir = readFileParentDir.replace(new RegExp(`^${folderName}/?`), '');
            if (!readFileParentDir) {
                zip.file(readFile.fileName, yield fs_1.fsPromise("readFile", readFile.filePath));
            }
            else {
                if (!dict.get(readFileParentDir))
                    dict.set(readFileParentDir, zip.folder(readFileParentDir));
                const folderZip = dict.get(readFileParentDir);
                folderZip.file(readFile.fileName, yield fs_1.fsPromise("readFile", readFile.filePath));
            }
            runtime && runtime(readFile.filePath);
        }
    }
    const zipBuffer = yield zip.generateAsync({ type: "nodeBuffer" });
    yield fs_1.fsPromise("writeFile", targetFilePath, zipBuffer);
});
exports.zipLoad = (zipFilePath, outDir, runtime) => __awaiter(void 0, void 0, void 0, function* () {
    zipFilePath = path_1.default.resolve(zipFilePath);
    outDir = path_1.default.resolve(outDir);
    fs_1.perfectMkdir(outDir);
    const zipBuffer = yield fs_1.fsPromise("readFile", zipFilePath);
    const zip = new jszip();
    const result = yield zip.loadAsync(zipBuffer, { createFolders: true });
    const files = result.files;
    let zipFile;
    let fileOutPath;
    for (let key of Object.keys(files)) {
        zipFile = files[key];
        if (!zipFile.dir) {
            try {
                fileOutPath = path_1.default.resolve(outDir, zipFile.name);
                fs_1.checkFileAndMkdir(fileOutPath);
                const ws = fs_2.default.createWriteStream(fileOutPath);
                zipFile.nodeStream().pipe(ws);
                runtime && runtime(fileOutPath);
            }
            catch (e) {
                console.error(`unzip failure : ${fileOutPath}`);
                console.error(e);
            }
        }
    }
});
