
const fs = window.require("fs");
import * as xlsx from "xlsx";

export function outputToJson(str: any, outDir: string, fileName: string, sheetName: string) {
    str = JSON.stringify(str);

    outDir = outDir + "/json"
    checkExitDir(outDir);

    fileName = fileName.split('.')[0];
    if (!!sheetName) fileName += `_${sheetName}`
    fileName += `.json`
    let name = outDir + "/" + fileName;
    fs.writeFileSync(name, str);
}

export function outputdts(clsobj: string, outDir: string, fileName: string, sheetName: string) {
    outDir = outDir + "/ts"
    checkExitDir(outDir);

    fileName = fileName.split('.')[0];
    if (!!sheetName) fileName += `_${sheetName}`;
    let str = "declare interface " + fileName + "JsonInfo" + clsobj;
    fileName += `.d.ts`

    let name = outDir + "/" + fileName;
    fs.writeFileSync(name, str);
}

export function createClassifier(namelist: Array<string>, valuelist: Array<string>) {
    // console.log(namelist,valuelist,"name,value")
    let out: any = {}
    namelist.map((name, index) => {
        out[name] = valuelist[index]
        if (valuelist[index].indexOf("Array") != -1) {
            let tmp = valuelist[index].split("|");
            out[name] = `${tmp[0]}<${tmp[1]}>`;
        }
    })

    //变成字符串
    let strout = "";
    Object.keys(out).map((name, index) => {
        strout = strout + name + ":" + out[name] + ";"
    })
    return "{" + strout + "}"
}

export function xlsxReadLine(sheet: xlsx.WorkSheet, line: number) {
    let safe = sheet["!ref"] as string;
    let r = safe.split(":");
    let endC = r[1][0];
    let startC = r[0][0];
    let info = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        range: `${startC}${line}:${endC}${line}`
    });
    return info[0] as Array<any>;
}

export function checkExitDir(checkPath: string) {
    if (fs.existsSync(checkPath)) {
        return true;
    } else {
        fs.mkdirSync(checkPath);
        console.log("自动生成文件夹:" + checkPath);
    }
}