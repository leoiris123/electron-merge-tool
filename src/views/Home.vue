<template>
  <div class="home">
    <el-row type="flex" class="row">
      <el-button @click="handleImport" type="primary">导入路径</el-button>
      <el-input :value="dirPath" placeholder="请选择"></el-input>
    </el-row>
    <el-row type="flex" class="row">
      <el-button @click="handleExport(exportPath, true)" type="primary"
        >导出Json路径</el-button
      >
      <el-input
        :value="exportPath.exportJsonPath"
        placeholder="请选择"
      ></el-input>
    </el-row>
    <el-row type="flex" class="row">
      <el-button @click="handleExport(exportPath, false)" type="primary"
        >导出TsClass路径</el-button
      >
      <el-input
        :value="exportPath.exportTsPath"
        placeholder="请选择"
      ></el-input>
    </el-row>
    <el-row v-if="errNameList.length > 0" type="flex" class="row">
      <div v-for="(item, index) in errNameList" :key="index">
        <!-- <el-button @click="handleClear" type="warning">清空选项</el-button> -->
        <el-input :value="item"></el-input>
      </div>
    </el-row>
    <el-row type="flex">
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
import { Loading } from "element-ui";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      loadingInstance: null,
      rootPath: "kong",
      dirPath: "", //总引入路径
      exportPath: {
        exportJsonPath: "",
        exportTsPath: "",
      }, //总导出路径
      fileList: [], //最外层文件列表
      singleDirList: [], //第二层文件夹

      //
      errNameList: [], // 所有错误的文件
    };
  },
  mounted() {
    let dirPath = localStorage.getItem("dirPath");
    let exportJsonPath = localStorage.getItem("exportJsonPath");
    let exportTsPath = localStorage.getItem("exportTsPath");
    if (dirPath) {
      this.dirPath = dirPath;
      this.loadDir(dirPath, this.fileList, this.singleDirList);
      console.log(dirPath, "dirPath");
    }
    if (exportJsonPath) {
      this.exportPath.exportJsonPath = exportJsonPath;
    }
    if (exportTsPath) {
      this.exportPath.exportTsPath = exportTsPath;
    }
    console.log(this.exportPath, "this.exportPath");
  },
  methods: {
    checkExitDir(checkPath) {
      if (fs.existsSync(checkPath)) {
        return true;
      } else {
        fs.mkdirSync(checkPath);
        console.log("自动生成文件夹:" + checkPath);
      }
    },

    loadFile(dirPath, exportdirPath, name) {
      loader.loadXLSX(dirPath, exportdirPath, name).catch((res) => {
        console.log("返回：", res);
        this.errNameList.push(res);
      }); //复用
    },
    handleClear() {
      this.dirPath = "";
      this.exportPath = {
        exportJsonPath: "",
        exportTsPath: "",
      };
      this.fileList = [];
      localStorage.removeItem("dirPath");
      localStorage.removeItem("exportJsonPath");
      localStorage.removeItem("exportTsPath");
    },
    handleConfirm() {
      console.log("确认");
      this.loadingInstance = null;
      this.loadingInstance = Loading.service({ fullscreen: true });
      if (
        this.dirPath == "" ||
        this.fileList == [] ||
        this.exportdirPath == ""
      ) {
        this.$message("请选择路径");
        return;
      }
      this.errNameList = []; //重置错误列表
      // console.log(
      //   this.fileList,
      //   this.singleDirList,
      //   this.dirPath,
      //   this.exportPath,
      //   " this.fileList,this.singleDirList,this.dirPath,this.exportPath,"
      // );
      this.fileList.map((item, index) => {
        this.loadFile(this.dirPath, this.exportPath, item);
      });
      // 读取第二层文件夹
      console.log(this.singleDirList, "this.singleDirList");
      this.singleDirList.forEach((item) => {
        let singlefilelist = [];
        let singledirlist = [];
        let singleInPath = this.dirPath + "/" + item;
        let singleOutJsonPath = this.exportPath.exportJsonPath + "/" + item;
        let singleOutTsPath = this.exportPath.exportTsPath + "/" + item;
        let outPath = {
          exportJsonPath: singleOutJsonPath,
          exportTsPath: singleOutTsPath,
        };
        this.checkExitDir(singleOutJsonPath);
        this.checkExitDir(singleOutTsPath);
        this.loadDir(singleInPath, singlefilelist, singledirlist).then(
          (res) => {
            setTimeout(() => {
              // console.log(
              //   singlefilelist,
              //   singleInPath,
              //   outPath,
              //   "singlefilelist,singleInPath, outPath"
              // );
              singlefilelist.forEach((item1) => {
                this.loadFile(singleInPath, outPath, item1);
              });
            }, 100);
          }
        );
      });

      this.checkerrNameList();
    },
    checkerrNameList() {
      // 延迟判断 后期优化 qaq
      setTimeout(() => {
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          this.loadingInstance.close();
          this.$notify({
            title: this.errNameList.length > 0 ? "请查看错误列表" : "转换成功",
            message: "转换结束",
            type: this.errNameList.length > 0 ? "warning" : "success",
            duration: 700,
          });
        });
      }, 2000);
    },
    loadDir(dirPath, filelist, dirlist) {
      return new Promise((resolve, reject) => {
        //获取文件夹下的文件列表
        console.log(dirPath, "this.dirPath");
        let reg = /^\./;
        fs.readdir(dirPath, (err, files) => {
          if (err) {
            console.log(err);
          } else {
            files.filter((x) => {
              let state = fs.lstatSync(dirPath + "/" + x);
              if (state.isDirectory()) {
                dirlist.push(x);
              } else {
                if (!reg.test(x)) {
                  filelist.push(x);
                }
              }
              return !state.isDirectory();
            });
          }
        });
        resolve("success");
      }).catch(() => {});
    },
    //导入路径
    handleImport() {
      console.log("引入");
      dialog
        .showOpenDialog({
          properties: ["openFile", "openDirectory"],
        })
        .then((result) => {
          if (!result.canceled) {
            this.dirPath = result.filePaths[0];
            localStorage.setItem("dirPath", this.dirPath);
            this.loadDir(this.dirPath, this.fileList, this.singleDirList);
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
    handleExport(exportPath, isjson) {
      console.log("导出");
      dialog
        .showOpenDialog({
          properties: ["openFile", "openDirectory"],
        })
        .then((result) => {
          if (!result.canceled) {
            if (isjson) {
              exportPath.exportJsonPath = result.filePaths[0];
              localStorage.setItem("exportJsonPath", result.filePaths[0]);
            } else {
              exportPath.exportTsPath = result.filePaths[0];
              localStorage.setItem("exportTsPath", result.filePaths[0]);
            }
          } else {
            this.$notify({
              title: "已取消",
              message: "取消读取路径",
              type: "warning",
              duration: 500,
            });
          }
          console.log(result.filePaths[0], "选择的路径");
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
.row {
  margin-bottom: 15px;
}
</style>
