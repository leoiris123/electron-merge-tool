const SET_SECTION_LIST = "set_section_list"; //设置对话场景数据
const SET_DIALOG_LIST = "set_dialog_list"; //设置对白资源
const SET_DIALOG_EDIT_LIST = "set_dialog_edit_list"; //配置对白数据

const UPDATA_SECTION_LIST = "updata_section_list";
const UPDATA_DIALOG_LIST = "updata_dialog_list";
const UPDATA_SECTION = "updata_section";

import event from "../../../script/tool/event";

const state = {
  sectionList: {}, //场景列表数据
  dialogList: {}, // 对话分组数据
  dialogListArrange: {}, // 对话列表不分组数据
  dialogEditList: {}, //配置对白数据
};
const getters = {
  sectionListGet(state) {
    console.log("执行了==>sectionListGet");
    return state.sectionList;
  },
  dialogListGet(state) {
    console.log("执行了==>dialogListget");
    return state.dialogList;
  },
  dialogListArrangeGet(state) {
    console.log("执行了==>dialogListArrangeget");
    return state.dialogListArrange;
  },
  dialogEditListGet(state) {
    console.log("执行了==>dialogEditListGet");
    return state.dialogEditList;
  },
};
const mutations = {
  [SET_DIALOG_EDIT_LIST](state, data) {
    console.log(data, "执行了==>SET_DIALOG_EDIT_LIST");
    state.dialogEditList = data;
  },
  [SET_SECTION_LIST](state, data) {
    console.log(data, "执行了==>SET_SECTION_LIST");
    state.sectionList = data;
    console.log(state.sectionList, "sectionList");
  },
  [SET_DIALOG_LIST](state, data) {
    console.log(data, "执行了==>SET_DIALOG_LIST");
    state.dialogList = data;

    let dialogListArrange = {};
    //生成不分组的对话列表
    for (let key in state.dialogList) {
      Object.assign(dialogListArrange, state.dialogList[key]);
    }

    state.dialogListArrange = dialogListArrange;
    console.log(
      state.dialogListArrange,
      "state.dialogListArrange==>组合后数据"
    );
  },
  [UPDATA_SECTION_LIST](state, data) {
    if (data.type == "modify_normal") {
      state.sectionList[data.sectionName].states[data.stateGroupName][
        data.index
      ].messageId = data.messageId;
    }
    if (data.type == "add_normal") {
      state.sectionList[data.sectionName].states[data.stateGroupName].splice(
        data.index + 1,
        0,
        {
          messageId: data.messageId,
        }
      );
    }
    if (data.type == "delete_normal") {
      state.sectionList[data.sectionName].states[data.stateGroupName].splice(
        data.index,
        1
      );
    }
    if (data.type == "add_branch") {
      let currentid =  state.sectionList[data.sectionName].states[data.stateGroupName][data.index]
      if(currentid["choice"]){
        currentid["choice"].push(data.choice)
      }else {
        currentid["choice"] = []
        currentid["choice"].push(data.choice)
      }
    // ["choice"] = data.choice;
      console.log(
        state.sectionList[data.sectionName].states[data.stateGroupName],
        "state.sectionList[data.sectionName].states[data.stateGroupName]"
      );
    }
    if (data.type == "add_next") {
      state.sectionList[data.sectionName].states[data.stateGroupName][
        data.index
      ]["next"] = data.next;
    }
    if (data.type == "delete_next") {
      delete state.sectionList[data.sectionName].states[data.stateGroupName][
        data.index
      ]["next"];
    }
    console.log(data, "执行了==>UPDATA_SECTION_LIST");
    event.$emit("sectionChange", state.sectionList);
    // state.dialogList = data;
  },
  [UPDATA_DIALOG_LIST](state, data) {
    console.log(data, "执行了==>UPDATA_DIALOG_LIST");
    // state.dialogList = data;
  },
  [UPDATA_SECTION](state, data) {
    console.log(data, "执行了==>updata_SECTION");
    if (data.type == "add_section") {
      let describe = data.describe;
      if (!state.sectionList[describe]) {
        let section = {
          states: {
            "1": [
              {
                messageId: "init",
              },
            ],
          },
        };

        state.sectionList[describe] = section;
      }
    }
    if (data.type == "add_state") {
      let sectionName = data.sectionName;
      let stateName = data.stateName;
      if (state.sectionList[sectionName]) {
        if (!state.sectionList[sectionName].states[stateName]) {
          state.sectionList[sectionName].states[stateName] = [
            {
              messageId: "init",
            },
          ];
          console.log(state.sectionList, "state.sectionList");
        }
      }
    }
    if (data.type == "delete_state") {
      let sectionName = data.sectionName;
      let stateName = data.selectStateName;
      if (state.sectionList[sectionName]) {
        if (state.sectionList[sectionName].states[stateName]) {
          delete state.sectionList[sectionName].states[stateName];
          console.log(state.sectionList, "删除-state-state.sectionList");
        }
      }
    }
    if (data.type == "init_dialog") {
      let sectionName = data.sectionName;
      let selectStateName = data.selectStateName;

      if (state.sectionList[sectionName].states[selectStateName]) {
        state.sectionList[sectionName].states[selectStateName] = [
          {
            messageId: "init",
          },
        ];
        console.log(state.sectionList, "state.sectionList");
      }
    }
    if (data.type == "delete_section") {
      if (state.sectionList[data.sectionName]) {
        delete state.sectionList[data.sectionName];
        console.warn("删除了", data.sectionName);
      }
    }
    // if(!state.sectionList[describe]){
    //   state.sectionList[describe] = section
    // }

    event.$emit("sectionChange", state.sectionList);
    // state.dialogList = data;
  },
};

const actions = {
  UPDATA_SECTION({ commit }, data) {
    commit(UPDATA_SECTION, data);
  },
  UPDATA_SECTION_LIST({ commit }, data) {
    commit(UPDATA_SECTION_LIST, data);
  },
  UPDATA_DIALOG_LIST({ commit }, data) {
    commit(UPDATA_DIALOG_LIST, data);
  },
  SET_SECTION_LIST({ commit }, data) {
    commit(SET_SECTION_LIST, data);
  },
  SET_DIALOG_LIST({ commit }, data) {
    commit(SET_DIALOG_LIST, data);
  },
  SET_DIALOG_EDIT_LIST({ commit }, data) {
    commit(SET_DIALOG_EDIT_LIST, data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
