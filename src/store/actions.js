const actions = {
  showSnackbar ({ commit, state, rootState }, payload) {
    commit('setErrorMsg', payload.message)
    commit('setMessageColor', payload.color || 'error')
    commit('setShowMsg', true)
  }
}

export default actions
