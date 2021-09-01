const fs = window.require("fs");
const path = require("path");
import event from "../tool/event";
const exportPath = {
  sectionData: "/exportData/exportSection.json",
  dialogEditList: "/exportData/exportDialoglib.json",
  dialogListArrange:"/exportData/exportDialogConfig.json"
};
const savePath = {
    sectionData: "/section-1/conversation.json",
    dialogEditList:"/section-1/dialogEditData.json"
  };
export const exportutil = {

  //   exportBuilding(exportPath,str){
  //     const buildingListPath = path.join(
  //         exportPath,
  //         "buildingList.json"
  //     )

  //     if(!fs.existsSync(exportPath)) {
  //         fs.mkdirSync(exportPath)
  //     }
  //     fs.writeFileSync(buildingListPath, str)
  // },


  exportJSON(rootpath, fileName,str) {
    const sectionDataPath = path.join(rootpath, exportPath[fileName]);
    fs.writeFileSync(sectionDataPath, str)
    event.$notify({
        title: "导出成功",
        message: "导出成功",
        type: "success",
        duration: 1100,
      });
  },


  saveJSON(rootpath, fileName,str) {
    const sectionDataPath = path.join(rootpath, savePath[fileName]);
    fs.writeFileSync(sectionDataPath, str)
    event.$notify({
        title: "保存成功",
        message: "保存成功",
        type: "success",
        duration: 1100,
      });
  },
};
