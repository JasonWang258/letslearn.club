// import { postsCollection } from '@/firebaseConfig'

const state = {
  posts: [],
  hiddenPosts: []
}

const getters = {

}

const mutations = {
  setPosts (state, val) {
    if (val) {
      state.posts = val
    } else {
      state.posts = []
    }
  },
  setHiddenPosts (state, val) {
    if (val) {
      // make sure not to add duplicates
      if (!state.hiddenPosts.some(x => x.id === val.id)) {
        state.hiddenPosts.unshift(val)
      }
    } else {
      state.hiddenPosts = []
    }
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
