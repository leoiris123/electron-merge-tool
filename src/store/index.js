import Vue from 'vue'
import Vuex from 'vuex'
import section from "./modules/section"
import configuration from "./modules/configuration"
Vue.use(Vuex)

export default new Vuex.Store({

  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    namespaced: true, // 为了解决不同模块命名冲突的问题
    section,
    configuration
  }
})

