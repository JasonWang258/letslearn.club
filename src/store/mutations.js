import Vue from 'vue'

const mutations = {
  toggleDarkTheme (state) {
    state.isDarkTheme = !state.isDarkTheme
    Vue.prototype.$vuetify.theme.primary = state.isDarkTheme ? 'fefefe' : '#7986CB'
  }
}

export default mutations
