const fs = window.require("fs");
import XLSX from "xlsx";
const path = require("path");
import store from "../../src/store";
import { sorttool } from "../tool/sortData.js";
import event from "../tool/event";


function saveJSON(exportdirPathAll, fileName, str) {
  const exportDataPath = path.join(exportdirPathAll, "/" + fileName);
  fs.writeFileSync(exportDataPath, str);

}
export const loader = {

  // 加载XML文件
  loadXLSX(dirPath, exportPath, XLSXname) {

    return new Promise((resolve, reject) => {
      try {
        // console.log(dirPath, exportPath, XLSXname, "dirPath, exportPath, XLSXname")
        fs.readFile(dirPath + "/" + XLSXname, (err, data) => {
          if (err) {
            console.warn("err", err);
          }
          let wb = XLSX.read(data, { type: "buffer" });
          const result = [];
          //加载数据
          // if (XLSXname == "item")
          let headerNameList;
          let headertypeList;
          let ClassObj;
          wb.SheetNames.forEach((sheetName) => {
            let list;
            let headerlist;

            headerlist = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
              header: "A",
            });

            if (headerlist[2]) {
              if (!headerlist[5]) {
                reject(XLSXname)
                console.log("出错文件：第六行缺失", headerlist[2], headerlist[5], dirPath, exportPath, XLSXname, "headerlist[2], headerlist[5], dirPath, exportPath, XLSXname")
              }

              headerNameList = Object.values(headerlist[2]);
              headertypeList = Object.values(headerlist[5]).map((item) => {
                if (item == "int") {
                  return "number";
                }
                if (item == null || item == "") {
                  console.log("出错文件：标题有空值", headerlist[2], headerlist[5], dirPath, exportPath, XLSXname, "headerlist[2], headerlist[5], dirPath, exportPath, XLSXname")
                  reject(XLSXname)

                }
                return item;
              });

              if (headerNameList.length !== headertypeList.length) {
                console.log("出错文件：列表标题长度不一致", headerlist[2], headerlist[5], dirPath, exportPath, XLSXname, "headerlist[2], headerlist[5], dirPath, exportPath, XLSXname")
                reject(XLSXname)
                return
              }
              ClassObj = sorttool.createClassifier(headerNameList, headertypeList);
            } else {
              console.log(headerlist, "headerlist");
            }
            list = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {
              header: headerNameList,
            });

            result.push({
              name: sheetName,
              list,
              total: list.length || 0,
            });
          });

          let lastindex = XLSXname.indexOf(".xls")
          if (lastindex < 0) {
            event.$notify({
              title: XLSXname + "名称不符合规范",
              message: "失败",
              type: "warning",
              duration: 700,
            });
            return
          }
          let Name = XLSXname.slice(0, lastindex)
          let tsNameafter = Name + "JsonInfo" + ".ts"

          let jsonName = Name + ".json"
          // const CPath = path.join(dirPath, exportdirPath);

          let str = "export default class " + Name + "JsonInfo" + ClassObj;
          fs.writeFileSync(exportPath.exportTsPath + "/" + tsNameafter, str);

          //对导入的excel数据进行整理
          if (!result[0]) {
            console.log("出错文件：标题错误", dirPath, exportPath, XLSXname, "dirPath, exportPath, XLSXname")
            reject(XLSXname)
            return
          }
          let list = result[0].list;
          list.splice(0, 6);
          //将数据处理成列对应的形式
          let out = sorttool.sortData(list, headerNameList, headertypeList);
          let Str = JSON.stringify(out);
          saveJSON(exportPath.exportJsonPath, jsonName, Str);
          resolve(XLSXname)
        });
      } catch {
        console.log("出错文件：运行过程错误", dirPath, exportPath, XLSXname, " dirPath, exportPath, XLSXname")
        reject(XLSXname)
      }
    }
    )

  },

};
