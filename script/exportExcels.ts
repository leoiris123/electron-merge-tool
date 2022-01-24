import * as path from "path";
import * as fs from "fs";
import * as xlsx from "xlsx";
import { createClassifier, outputdts, outputToJson, xlsxReadLine } from "./utils";
import { ECANCELED } from "constants";

const skipFiles = ["pvp道具映射.xlsx"];

console.log(process.execPath)

// const excelsDir = '/Users/admin_aric/Documents/pvp_data/excel';
// const outDir = '/Users/admin_aric/Documents/pvp_data/output';


// export const exportExcelutil = {
//     loadXlsxBase(excDir: string, outDir: string) {
//         loadXlsx(excDir, outDir);
//     }
// }

export function loadXlsxBase(excDir: string, outDir: string) {
    loadXlsx(excDir, outDir);
    console.log("loadXlsxBase执行")
}

function loadXlsx(dir: string, out: string) {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.filter((x: string) => {
            let state = fs.lstatSync(dir + "/" + x);
            if (state.isDirectory()) {
                loadXlsx(dir + "/" + x, out + "/" + x);
            } else if (state.isFile()) {
                if (skipFiles.indexOf(x) != -1) return;
                if (x.endsWith("xlsx")) {
                    exportXlsx(dir + "/" + x, out, path.basename(x));
                }
            }
            return !state.isDirectory();
        });
    })
}

function exportXlsx(file: string, outDir: string, fileName: string) {
    fs.readFile(file, (err, data) => {
        if (err) { console.error(err); return };
        console.log("parse file", file);
        let wb = xlsx.read(data, { type: "buffer" });
        let extendSheetName = wb.SheetNames.length > 1 ? true : false;
        wb.SheetNames.forEach((sheetName) => {
            let sheet = wb.Sheets[sheetName];
            let headerInfo = xlsxReadLine(sheet, 2);
            let typeInfo = xlsxReadLine(sheet, 3);

            let skipCol = 3;
            let info = xlsx.utils.sheet_to_json(sheet, {
                header: headerInfo,
                range: skipCol
            });
            let paramType = formatHeader(headerInfo, typeInfo);
            let fData = formatData(info, paramType, true);

            outputToJson(fData, outDir, fileName, extendSheetName ? sheetName : "");
            outputdts(createClassifier(headerInfo, typeInfo), outDir, fileName, extendSheetName ? sheetName : "");
        })
    })
}

/**
 * 转换字段类型
 * 合并同类项
 * 允许超过header数量的列存在，并且不予导出
 * @param datas 
 * @param typeInfo 
 */
function formatData(datas: Array<any>, typeInfo: { [name: string]: string }, splitData: boolean) {
    let f_data: any = {};
    for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        //先转变类型
        for (let n in data) {
            if (data[n] == null) {
                console.warn(n + "is empty");
            }
            if (typeInfo[n] == "number") {
                try {
                    data[n] = +data[n];
                } catch (err) {
                    throw (new Error("字段不能转换类型:" + n));
                }
            } else if (typeInfo[n].startsWith("Array")) {
                let tmp: string = data[n] + "";
                data[n] = tmp.split("\n");

                let inType = typeInfo[n].split("|")[1];
                for (let m = 0; m < data[n].length; m++) {
                    if (data[n][m] == "") {
                        data[n].splice(m, 1);
                        m--;
                        continue;
                    }
                    if (inType == "number") {
                        data[n][m] = +data[n][m];
                    } else if (inType == "string") {
                        data[n][m] = data[n][m] + "";
                    } else {
                        throw (new Error("未知array 类型:" + typeInfo[n]));
                    }
                }
            } else if (typeInfo[n] == "string") {
                data[n] = data[n] + "";
            } else {
                throw (new Error("未知字段类型:" + typeInfo[n]));
            }
        }
        let id = data["id"];
        if (f_data[id]) {
            // throw (new Error("重复id:" + id));
            for (let n in data) {
                if (typeInfo[n].startsWith("Array")) {
                    f_data[id][n].push(...data[n]);
                }
            }
        } else {
            f_data[id] = data;
        }
    }
    return f_data;
}

function formatHeader(headerInfo: Array<string>, typeInfo: Array<string>) {
    if (headerInfo.length != typeInfo.length) {
        throw (new Error("字段数量 和 字段类型数量不一致"));
    }

    let format: any = {};
    for (let i = 0; i < headerInfo.length; i++) {
        format[headerInfo[i]] = typeInfo[i];
    }

    return format;
}