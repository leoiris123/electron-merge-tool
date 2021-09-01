const SET_CONFIGURATION = "set_configuration" // 人物 音效等配置
const SET_TEXT_CONFIG = "set_text_config" //场景id与中文描述
const state = {
    configuration:{},
    textConfig:{}
};

const mutations = {
    [SET_CONFIGURATION](state,data){
        console.log(data,"<==执行了SET_CONFIGURATION")
        state.configuration = data
    },
    [SET_TEXT_CONFIG](state,data){
        console.log(data,"<==执行了SET_TEXT_CONFIG")
        state.textConfig = data
    }
};
const getters = {
    configurationGet(state){
        console.log("执行了==>configurationGet");
        return state.configuration
    },
    textConfigGet(state){
        console.log("执行了==>textConfigGet");
        return state.textConfig
    }
};
const actions = {
    SET_CONFIGURATION({ commit }, data) {
        commit(SET_CONFIGURATION, data);
    },
    SET_TEXT_CONFIG({ commit }, data) {
        commit(SET_TEXT_CONFIG, data);
    },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};