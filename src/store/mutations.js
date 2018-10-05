import Vue from 'vue'

const mutations = {
  toggleDarkTheme (state) {
    state.isDarkTheme = !state.isDarkTheme
    Vue.prototype.$vuetify.theme.primary = state.isDarkTheme ? 'fefefe' : '#7986CB'
  },
  setErrorMsg (state, payload) {
    state.errorMsg = payload
  },
  setShowMsg (state, payload) {
    state.showMessage = payload
  },
  setMessageColor (state, payload) {
    state.messageColor = payload
  },
  setMessageTimeout (state, payload) {
    state.messageTimeout = payload
  }
}

export default mutations
