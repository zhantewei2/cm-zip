"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zip_1 = require("./untils/zip");
var fs_1 = require("./untils/fs");
exports.fsPromise = fs_1.fsPromise;
exports.perfectMkdir = fs_1.perfectMkdir;
exports.checkFileAndMkdir = fs_1.checkFileAndMkdir;
exports.readDir = fs_1.readDir;
exports.zip = zip_1.zipFolder;
exports.unzip = zip_1.zipLoad;
