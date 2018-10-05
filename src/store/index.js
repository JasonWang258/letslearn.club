import Vue from 'vue'
import Vuex from 'vuex'
import users from '@/store/modules/users'
import blog from '@/store/modules/blog'
import mutations from '@/store/mutations'
import actions from '@/store/actions'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isDarkTheme: false,
    errorMsg: '',
    showMessage: false,
    messageColor: 'error',
    messageTimeout: 6000
  },
  mutations: mutations,
  actions: actions,
  modules: {
    users,
    blog
  }
})

export default store
