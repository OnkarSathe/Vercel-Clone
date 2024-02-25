//@ts-ignore
import { exec, spawn } from "child_process";
//@ts-ignore
import path from "path";

export function buildProject(id: string) {
    return new Promise((resolve)=>{
        //@ts-ignore
        const child = exec(`cd ${path.join(__dirname , `output/${id}`)} && npm install && npm run build`)
    
        child.stdout?.on('data' , function(data:any){
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data' , function(data:any){
            console.log('stderr: ' + data);
        });

        child.on('close' , function(code:any){
            resolve("");
        });
    });
}
