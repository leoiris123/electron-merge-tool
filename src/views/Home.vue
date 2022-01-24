<template>
  <div class="home">
    <el-row type="flex" class="row">
      <el-button @click="handleImport" type="primary">导入路径</el-button>
      <el-input :value="dirPath" placeholder="请选择"></el-input>
    </el-row>
    <el-row type="flex" class="row">
      <el-button @click="handleExport(exportPath)" type="primary"
        >导出导出路径</el-button
      >
      <el-input :value="exportPath" placeholder="请选择"></el-input>
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

import { loadXlsxBase } from "../../script/exportExcels.js";
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
      exportPath: "", //总导出路径
      fileList: [], //最外层文件列表
      singleDirList: [], //第二层文件夹

      errNameList: [], // 所有错误的文件
    };
  },
  mounted() {
    let dirPath = localStorage.getItem("dirPath");
    let exportPath = localStorage.getItem("exportPath");
    if (dirPath) {
      this.dirPath = dirPath;
      console.log(dirPath, "dirPath");
    }
    if (exportPath) {
      this.exportPath = exportPath;
    }
    console.log(this.exportPath, "this.exportPath");
  },
  methods: {
    handleClear() {
      this.dirPath = "";
      this.exportPath = "";
      localStorage.removeItem("dirPath");
      localStorage.removeItem("exportPath");
    },
    handleConfirm() {
      console.log("确认");

      if (this.dirPath == "" || this.exportPath == "") {
        this.$message("请选择路径");
        return;
      }

      loadXlsxBase(this.dirPath, this.exportPath);
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
    handleExport(exportPath) {
      console.log("导出");
      dialog
        .showOpenDialog({
          properties: ["openFile", "openDirectory"],
        })
        .then((result) => {
          if (!result.canceled) {
            this.exportPath = result.filePaths[0];
            localStorage.setItem("exportPath", result.filePaths[0]);
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
