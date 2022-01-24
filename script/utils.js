"use strict";
exports.__esModule = true;
exports.checkExitDir = exports.xlsxReadLine = exports.createClassifier = exports.outputdts = exports.outputToJson = void 0;
const fs = window.require("fs");
var xlsx = require("xlsx");
function outputToJson(str, outDir, fileName, sheetName) {
    str = JSON.stringify(str);
    outDir = outDir + "/json";
    checkExitDir(outDir);
    fileName = fileName.split('.')[0];
    if (!!sheetName)
        fileName += "_" + sheetName;
    fileName += ".json";
    var name = outDir + "/" + fileName;
    fs.writeFileSync(name, str);
}
exports.outputToJson = outputToJson;
function outputdts(clsobj, outDir, fileName, sheetName) {
    outDir = outDir + "/ts";
    checkExitDir(outDir);
    fileName = fileName.split('.')[0];
    if (!!sheetName)
        fileName += "_" + sheetName;
    var str = "declare interface " + fileName + "JsonInfo" + clsobj;
    fileName += ".d.ts";
    var name = outDir + "/" + fileName;
    fs.writeFileSync(name, str);
}
exports.outputdts = outputdts;
function createClassifier(namelist, valuelist) {
    // console.log(namelist,valuelist,"name,value")
    var out = {};
    namelist.map(function (name, index) {
        out[name] = valuelist[index];
        if (valuelist[index].indexOf("Array") != -1) {
            var tmp = valuelist[index].split("|");
            out[name] = tmp[0] + "<" + tmp[1] + ">";
        }
    });
    //变成字符串
    var strout = "";
    Object.keys(out).map(function (name, index) {
        strout = strout + name + ":" + out[name] + ";";
    });
    return "{" + strout + "}";
}
exports.createClassifier = createClassifier;
function xlsxReadLine(sheet, line) {
    var safe = sheet["!ref"];
    var r = safe.split(":");
    var endC = r[1][0];
    var startC = r[0][0];
    var info = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        range: "" + startC + line + ":" + endC + line
    });
    return info[0];
}
exports.xlsxReadLine = xlsxReadLine;
function checkExitDir(checkPath) {
    if (fs.existsSync(checkPath)) {
        return true;
    }
    else {
        fs.mkdirSync(checkPath);
        console.log("自动生成文件夹:" + checkPath);
    }
}
exports.checkExitDir = checkExitDir;
