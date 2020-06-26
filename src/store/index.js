import Vue from 'vue'
import Vuex from 'vuex'
import menu from './modules/menu.js'
import user from './modules/user.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    menu,
    user
  }
})
