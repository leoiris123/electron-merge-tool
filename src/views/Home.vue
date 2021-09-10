<template>
  <div class="home">

    <el-row type="flex" class="row">
      <el-button @click="handleImport" type="primary">导入路径</el-button>
      <el-input :value="dirPath" placeholder="请选择"></el-input>
    </el-row>
    <el-row type="flex" class="row">
      <el-button @click="handleExport" type="primary">导出路径</el-button>
      <el-input :value="exportdirPath" placeholder="请选择"></el-input>
    </el-row>
    <el-row type="flex" >
      <el-button @click="handleClear" type="warning">清空选项</el-button>
      <el-button @click="handleConfirm" type="danger">开始转换</el-button>
    </el-row>
  </div>
</template>

<script>
// @ is an alias to /src
import { loader } from "../../script/load/load.js";
import { exportutil } from "../../script/load/exportfile.js";
const { dialog } = window.require("electron").remote;
const fs = window.require("fs");
export default {
  name: "Home",
  components: {},
  data() {
    return {
      rootPath: "kong",
      dirPath: "",
      exportdirPath: "",
      fileList: [],
    };
  },
  mounted(){
       let dirPath = localStorage.getItem("dirPath");
       let exportdirPath = localStorage.getItem("exportdirPath");
        if(dirPath){
          this.dirPath = dirPath
             this.loadDir()
          console.log(dirPath,"dirPath")
        }
         if(exportdirPath){
          this.exportdirPath = exportdirPath
        }
  },
  methods: {  checkExportPathDir(path){
      console.log(path,"outpath")
      let jsonpath = path + "/json"
      let tspath = path + "/ts"
       if(fs.existsSync(jsonpath) && fs.existsSync(tspath)){
        console.log( "确认存在 返回 true")
        return true
      }
      if(!fs.existsSync(jsonpath)){
        fs.mkdirSync(jsonpath)
               this.$notify({
        title: "导出路径缺失 /json",
        message: "已自动生成",
        type: "success",
        duration: 500,
      });
      }
      if(!fs.existsSync(tspath)){
        fs.mkdirSync(tspath)
               this.$notify({
        title: "导出路径缺失 /ts",
        message: "已自动生成",
        type: "success",
        duration: 500,
      });
      }
      if(fs.existsSync(jsonpath) && fs.existsSync(tspath)){
        console.log( "确认存在 返回 true")
        return true
      }
      return false
    },
    loadFile(dirPath, exportdirPath, name) {
      loader.loadXLSX(dirPath, exportdirPath, name); //复用
    },
    handleClear(){
      this.dirPath = ""
      this.exportdirPath = ""
      this.fileList = []
    },
    handleConfirm() {
      console.log("确认");
      if (
        this.dirPath == "" ||
        this.fileList == [] ||
        this.exportdirPath == ""
      ) {
        this.$notify({
          title: "不完整",
          message: "请选择路径",
          type: "warning",
          duration: 500,
        });
        return;
      }
           let checkpass =  this.checkExportPathDir(this.exportdirPath)
     console.log(checkpass,"checkpass")
     if(!checkpass){
       this.$notify({
        title: "导出路径出错",
        message: "抓程序 改！",
        type: "warning",
        duration: 500,
      });
       return
     }
      this.fileList.map((item, index) => {
        this.loadFile(this.dirPath, this.exportdirPath, item);

        console.log(
          this.dirPath,
          this.exportdirPath,
          item,
          "this.dirPath,this.exportdirPath,item"
        );
      });
      this.$notify({
        title: "操作成功",
        message: "操作成功",
        type: "success",
        duration: 500,
      });
    },
    //获取文件名列表
    loadDir() {
      //获取文件夹下的文件列表
      console.log(this.dirPath, "this.dirPath");
      fs.readdir(this.dirPath, (err, files) => {
        if (err) {
          console.log(err);
        } else {
          // console.log(files); 返回的文件是个数组,可以用forEach循环输出文件名
          files.forEach((x) => {
            console.log("有" + x + "这个文件");
          });
          this.fileList = files;
          this.$notify({
            title: "导入路径成功",
            message: "导入路径成功",
            type: "success",
            duration: 500,
          });
        }
      });
    },
    //导入路径
    handleImport() {
      console.log("引入");

      dialog
        .showOpenDialog({
          properties: ["openFile", "openDirectory"],
        })
        .then((result) => {
          console.log(result.canceled, "1");
          if (!result.canceled) {
            this.dirPath = result.filePaths[0];
            localStorage.setItem("dirPath",this.dirPath);
            this.loadDir(this.dirPath);
          } else {
            this.$notify({
              title: "已取消",
              message: "取消读取路径",
              type: "warning",
              duration: 900,
            });
          }
          console.log(result.filePaths, "2");
        })
        .catch((err) => {
          console.log(err, "3");
          this.$notify.error({
            title: "读取路径失败",
            message: "读取路径失败",
            duration: 1500,
          });
        });
    },

    //导出路径
    handleExport() {
      console.log("导出");
      dialog
        .showOpenDialog({
          properties: ["openFile", "openDirectory"],
        })
        .then((result) => {
          console.log(result.canceled, "1");
          if (!result.canceled) {
            this.exportdirPath = result.filePaths[0];
             localStorage.setItem("exportdirPath",this.exportdirPath);
            this.$notify({
              title: "选择导出路径成功",
              message: "选择导出路径成功",
              type: "success",
              duration: 500,
            });
          } else {
            this.$notify({
              title: "已取消",
              message: "取消读取路径",
              type: "warning",
              duration: 500,
            });
          }
          console.log(result.filePaths, "2");
        })
        .catch((err) => {
          console.log(err, "3");
          this.$notify.error({
            title: "读取路径失败",
            message: "读取路径失败",
            duration: 1500,
          });
        });
    },
  },
};
</script>

<style scoped>
.row{
  margin-bottom: 15px;
}
</style>
