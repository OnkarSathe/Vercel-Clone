import fs from "fs";
import path from "path";

export function getAllFiles(filePath:any){
    let files:string[] = [];

    const fileList = fs.readdirSync(filePath);
    for(const file of fileList){
        const name = path.join(filePath , file);
        if(fs.statSync(name).isDirectory()){
            files = files.concat(getAllFiles(name));
        }else{
            files.push(name);
        }
    }
    return files;
}