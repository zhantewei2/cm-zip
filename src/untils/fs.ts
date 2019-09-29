import { Stats } from "fs";
import Path from "path";
const fs=require("fs");

export const fsPromise=<T> (method:string,...args:any):Promise<T>=>new Promise((resolve,reject)=>{
    fs[method].call(fs,...args,(err:Error,result:T)=>{
        if(err)return reject(err)
        resolve(result);
    })
})

export interface ReadFileRef{
    type:'file'|'dir';
    filePath:string;
    parentDirPath?:string;
    fileName:string;
}

export const _readDir=async(pathUri:string,relativePath:string,listReadFile:ReadFileRef[])=>{
    const statActive:Stats= await fsPromise("stat",pathUri);
    let readFileRef:ReadFileRef;
    let fileName=pathUri.match(/[^/\^\\]*$/g)[0];
    if(statActive.isFile()){
        readFileRef={
            "type":"file",
            "filePath":pathUri,
            "parentDirPath":relativePath,
            fileName
        }
        listReadFile.push(readFileRef);
    }else if(statActive.isDirectory()){
        readFileRef={
            fileName,
            "type":"dir",
            "filePath":pathUri,
        }
        listReadFile.push(readFileRef);
        const list:string[]=await fsPromise("readdir",pathUri);
        for(let name of list){
            await _readDir(
                Path.resolve(pathUri,name),
                relativePath?relativePath+"/"+fileName:fileName,
                listReadFile
            )   
        }
    }
}

export const readDir=async(pathUri:string):Promise<ReadFileRef[]>=>{
    try{
        pathUri=Path.resolve(pathUri);
        const list:ReadFileRef[]=[];
        await _readDir(pathUri,"",list);
        return list;
    }catch(e){
        console.log(e)
    }
}

export const mkdir=async(dir:string):Promise<void>=>{
    try{
        await fsPromise("mkdir",dir);
    }catch(e){
        console.log(e)
    }
}

export const perfectMkdir=(dir:string,mklist:string[]=[],main=true)=>{
    if(fs.existsSync(dir))return false;
    mklist.push(dir);
    perfectMkdir(Path.dirname(dir),mklist,false);
    
    if(main){
        for(let i of mklist.reverse()){
            fs.mkdirSync(i);
        }
    }
    return true;
}

export const checkFileAndMkdir=(filePath:string):boolean=>perfectMkdir(Path.dirname(filePath));
