const fs = window.require("fs");
import XLSX from "xlsx";
const path = require("path");
import store from "../../src/store";
import { sorttool } from "../tool/sortData.js";
import event from "../tool/event";
const fileList = {};
const XLSXList = {
  //   excelDialog: "/section-1/Dialog.xls",
  item: {
    localPath: "/excel/item.xlsx",
    exportdirPath: "/xml/json/item.json",
    exportClassPath: "/xml/ts/item.ts",
  },
  Cutitem: {
    localPath: "/excel/Cutitem.xlsx",
    exportdirPath: "/xml/json/Cutitem.json",
    exportClassPath: "/xml/ts/Cutitem.ts",
  },
};

function saveJSON(exportdirPathAll, fileName, str) {
  const exportDataPath = path.join(exportdirPathAll,"/"+fileName);
  fs.writeFileSync(exportDataPath, str);

}
export const loader = {
  // 加载XML文件
  loadXLSX(dirPath,exportdirPath,XLSXname) {
    fs.readFile(dirPath + "/"+XLSXname, (err, data) => {
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
          headerNameList = Object.values(headerlist[2]);
          headertypeList = Object.values(headerlist[5]).map((item) => {
            if (item == "int") {
              return "number";
            }
            return item;
          });
          ClassObj = sorttool.createClassifier(headerNameList, headertypeList);
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
      if(lastindex<0){
        event.$notify({
          title: XLSXname +"名称不符合规范",
          message: "失败",
          type: "warning",
          duration: 700,
        });
        return
      }
      let Name  = XLSXname.slice(0,lastindex) 
      let tsNameafter = Name + "JsonInfo"+".ts"

      let jsonName = Name + ".json"
      // const CPath = path.join(dirPath, exportdirPath);

      let str = "export default class " + Name + "JsonInfo"+ ClassObj;
      console.log(str, "写ts的str");
      console.log(Name,"Name")
      fs.writeFileSync(exportdirPath+"/ts/"+tsNameafter, str);

      //对导入的excel数据进行整理
      let list = result[0].list;
      list.splice(0, 6);
      console.log(list, "list");
      //将数据处理成列对应的形式
      let out = sorttool.sortData(list,headerNameList,headertypeList);
      let Str = JSON.stringify(out);
      saveJSON(exportdirPath+"/json/", jsonName, Str);
    });
  },
 
};
