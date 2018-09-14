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

// -- posts --
// subject
// content
// authorUid
// authorNickname
// createdOn
// modifiedOn
// likes

// -- comments --
// postID
// content
// fromUid
// createdOn
// modifiedOn
// fromDevice
// atUid
// atNickname
// replyToID // if null -> comment else -> reply
// likes

// -- users --
// nickName
// bookmarks
// roles

const actions = {
  async createPost ({ commit, state, rootState }, data) {
    console.log(rootState.isDarkTheme)
    let post = await postsCollection.add({
      subject: data.subject,
      content: data.content,
      authorUid: data.uid,
      authorNickname: data.authorNickname,
      createdOn: data.createdOn,
      likes: []
    })
    console.log(post)
  },
  async getPost ({ commit, state, rootState }, data) {
    console.log(data)
  },
  async getPosts ({ commit, state, rootState }, data) {
    console.log(data)
  },
  async getComments ({ commit, state, rootState }, data) {
    console.log(data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
