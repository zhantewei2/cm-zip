import {zipFolder,zipLoad} from "./untils/zip";


export {fsPromise,perfectMkdir,checkFileAndMkdir,readDir} from "./untils/fs";

export const zip=zipFolder;
export const unzip=zipLoad;
