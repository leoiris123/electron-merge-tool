"use strict";
// exports.__esModule = true;
var path = require("path");

const fs = window.require("fs");
var xlsx = require("xlsx");
var utils_1 = require("./utils");
var skipFiles = ["pvp道具映射.xlsx"];
console.log(process.execPath);
var excelsDir = '/Users/admin_aric/Documents/pvp_data/excel';
var outDir = '/Users/admin_aric/Documents/pvp_data/output';
// loadXlsx(excelsDir, outDir);

export function loadXlsxBase(excDir, outDir) {
    loadXlsx(excDir, outDir);
    console.log("loadXlsxBase执行")
}
function loadXlsx(dir, out) {
    fs.readdir(dir, function (err, files) {
        if (err) {
            console.error(err);
            return;
        }
        files.filter(function (x) {
            var state = fs.lstatSync(dir + "/" + x);
            if (state.isDirectory()) {
                loadXlsx(dir + "/" + x, out + "/" + x);
            }
            else if (state.isFile()) {
                if (skipFiles.indexOf(x) != -1)
                    return;
                if (x.endsWith("xlsx")) {
                    exportXlsx(dir + "/" + x, out, path.basename(x));
                }
            }
            return !state.isDirectory();
        });
    });
}
function exportXlsx(file, outDir, fileName) {
    fs.readFile(file, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        ;
        console.log("parse file", file);
        var wb = xlsx.read(data, { type: "buffer" });
        var extendSheetName = wb.SheetNames.length > 1 ? true : false;
        wb.SheetNames.forEach(function (sheetName) {
            var sheet = wb.Sheets[sheetName];
            var headerInfo = (0, utils_1.xlsxReadLine)(sheet, 2);
            var typeInfo = (0, utils_1.xlsxReadLine)(sheet, 3);
            var skipCol = 3;
            var info = xlsx.utils.sheet_to_json(sheet, {
                header: headerInfo,
                range: skipCol
            });
            var paramType = formatHeader(headerInfo, typeInfo);
            var fData = formatData(info, paramType, true);
            (0, utils_1.outputToJson)(fData, outDir, fileName, extendSheetName ? sheetName : "");
            (0, utils_1.outputdts)((0, utils_1.createClassifier)(headerInfo, typeInfo), outDir, fileName, extendSheetName ? sheetName : "");
        });
    });
}
/**
 * 转换字段类型
 * 合并同类项
 * 允许超过header数量的列存在，并且不予导出
 * @param datas
 * @param typeInfo
 */
function formatData(datas, typeInfo, splitData) {
    var _a;
    var f_data = {};
    for (var i = 0; i < datas.length; i++) {
        var data = datas[i];
        //先转变类型
        for (var n in data) {
            if (data[n] == null) {
                console.warn(n + "is empty");
            }
            if (typeInfo[n] == "number") {
                try {
                    data[n] = +data[n];
                }
                catch (err) {
                    throw (new Error("字段不能转换类型:" + n));
                }
            }
            else if (typeInfo[n].startsWith("Array")) {
                var tmp = data[n] + "";
                data[n] = tmp.split("\n");
                var inType = typeInfo[n].split("|")[1];
                for (var m = 0; m < data[n].length; m++) {
                    if (data[n][m] == "") {
                        data[n].splice(m, 1);
                        m--;
                        continue;
                    }
                    if (inType == "number") {
                        data[n][m] = +data[n][m];
                    }
                    else if (inType == "string") {
                        data[n][m] = data[n][m] + "";
                    }
                    else {
                        throw (new Error("未知array 类型:" + typeInfo[n]));
                    }
                }
            }
            else if (typeInfo[n] == "string") {
                data[n] = data[n] + "";
            }
            else {
                throw (new Error("未知字段类型:" + typeInfo[n]));
            }
        }
        var id = data["id"];
        if (f_data[id]) {
            // throw (new Error("重复id:" + id));
            for (let n in data) {
                if (typeInfo[n].startsWith("Array")) {
                    (_a = f_data[id][n]).push.apply(_a, data[n]);
                }
            }
        }
        else {
            f_data[id] = data;
        }
    }
    return f_data;
}
function formatHeader(headerInfo, typeInfo) {
    if (headerInfo.length != typeInfo.length) {
        throw (new Error("字段数量 和 字段类型数量不一致"));
    }
    var format = {};
    for (var i = 0; i < headerInfo.length; i++) {
        format[headerInfo[i]] = typeInfo[i];
    }
    return format;
}
