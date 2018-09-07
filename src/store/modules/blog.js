// import firebase from 'firebase/app'
import { postsCollection } from '@/firebaseConfig'

const state = {
  posts: [],
  hiddenPosts: [],
  comments: []
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
  async createPost ({ commit, state, rootState }, data) {
    console.log(rootState.isDarkTheme)
    let post = await postsCollection.doc().set({
      content: data.content,
      uid: data.uid,
      likes: []
    })
    console.log(post)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
