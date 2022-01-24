"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var xlsx = __importStar(require("xlsx"));
var skipFiles = ["pvp道具映射.xlsx"];
var excelsDir = '/Users/mybo/workspace/pvpMatch3/pvp_data/excel';
var outDir = '/Users/mybo/workspace/pvpMatch3/pvp_data/excel';
console.log(process.execPath);
// loadXlsx(excelsDir, outDir);
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
    console.log("export file", file);
    fs.readFile(file, function (err, data) {
        if (err) {
            console.error(err);
            return;
        }
        ;
        var wb = xlsx.read(data, { type: "buffer" });
        wb.SheetNames.forEach(function (sheetName) {
            var sheet = wb.Sheets[sheetName];
            var header = xlsxReadLine(sheet, 2);
            var skipCol = 3;
            var info = xlsx.utils.sheet_to_json(sheet, {
                header: header,
                range: skipCol
            });
            outputToJson(info, outDir, fileName, sheetName);
        });
    });
}
function outputToJson(str, outDir, fileName, sheetName) {
    str = JSON.stringify(str);
    fileName = fileName.split('.')[0];
    fileName += "_" + sheetName + ".json";
    var name = outDir + "/" + fileName;
    console.log(name);
    fs.writeFileSync(name, str);
}
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
