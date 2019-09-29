import {fsPromise,readDir, ReadFileRef,perfectMkdir,checkFileAndMkdir} from "./fs";
import Path from "path";
import fs from "fs";
import { Stats, ReadStream,WriteStream } from "fs";
const jszip=require("jszip");

export interface zipRuntime{
    (filepath:string):void;
}


export const zipFolder=async(inputDir:string,targetFilePath:string,runtime?:zipRuntime):Promise<void>=>{
    targetFilePath=Path.resolve(targetFilePath);
    const list:ReadFileRef[]= await readDir(inputDir);
    const folderName=Path.basename(inputDir);
    const dict:Map<string,any>=new Map<string,any>();

    const zip=new jszip();

    for (let readFile of list){
        if(readFile.type=="dir"||readFile.fileName==folderName)continue;
        if(readFile.type=="file"){
            let readFileParentDir:string=readFile.parentDirPath;
            //所有文件输出 至zip根目录
            readFileParentDir=readFileParentDir.replace(new RegExp(`^${folderName}/?`),'')
            //如果为根file
            if(!readFileParentDir){
                zip.file(readFile.fileName,await fsPromise("readFile",readFile.filePath))
            }else{
                if(!dict.get(readFileParentDir))dict.set(readFileParentDir,zip.folder(readFileParentDir));
                const folderZip:any=dict.get(readFileParentDir);
                folderZip.file(readFile.fileName,await fsPromise("readFile",readFile.filePath));
            }
            runtime&&runtime(readFile.filePath)
        }
    }
    const zipBuffer:Buffer=await zip.generateAsync({type:"nodeBuffer"})
    await fsPromise("writeFile",targetFilePath,zipBuffer);
}



export const zipLoad=async(zipFilePath:string,outDir:string,runtime?:zipRuntime):Promise<void>=>{
    zipFilePath=Path.resolve(zipFilePath);
    outDir=Path.resolve(outDir);
    perfectMkdir(outDir);
    
    const zipBuffer:Buffer=await fsPromise("readFile",zipFilePath);
    const zip=new jszip();
    const result=await zip.loadAsync(zipBuffer,{createFolders:true})
    const files:any=result.files;
    let zipFile:any;
    let fileOutPath:string;
    for(let key of Object.keys(files)){
        zipFile=files[key];
        if(!zipFile.dir){
            try{
                fileOutPath=Path.resolve(outDir,zipFile.name);
                checkFileAndMkdir(fileOutPath)
                const ws:WriteStream=fs.createWriteStream(fileOutPath)
                zipFile.nodeStream().pipe(ws);
                runtime&&runtime(fileOutPath);
            }catch(e){
                console.error(`unzip failure : ${fileOutPath}`)
                console.error(e);
            }
        }
    }
}