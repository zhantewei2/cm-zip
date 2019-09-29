#!/usr/bin/env node
import program from "commander";
import {VERSION} from "./setting";
import {zip,unzip} from "./index";
import chalk from "chalk";
import Path from "path";

const result:any=program
    .version(VERSION)
    .option("-x,--excute","uncompress")
    .option("-c,--create","compress")
    .parse(process.argv)

let [a,b]=result.args;
if(!a||!b){
    console.error(chalk.red`Be short of arguments`);
    process.exit();
}

const current_path=process.cwd();

a=Path.resolve(current_path,a);
b=Path.resolve(current_path,b);

const run=async()=>{
    try{
        if(result.excute){
            await unzip(a,b,(filePath:string)=>console.log(chalk.gray("unzip: "),filePath))
            console.info(chalk.cyan`uncompress complete~`);
        }else if(result.create){
            await zip(a,b,(filePath:string)=>console.log(chalk.gray("zip: "),filePath))
            console.log(chalk.cyan`compress complete~`)
        }
    }catch(e){
        console.log(e);
    }
}

run();