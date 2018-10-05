const actions = {
  showSnackbar ({ commit, state, rootState }, payload) {
    commit('setErrorMsg', payload.message)
    commit('setMessageColor', payload.color || 'error')
    commit('setMessageTimeout', payload.timeout || 6000)
    commit('setShowMsg', true)
  }
}

export default actions
