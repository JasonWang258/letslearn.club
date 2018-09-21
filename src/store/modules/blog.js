// import firebase from 'firebase/app'
import { postsCollection, commentsCollection } from '@/firebaseConfig'

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
  },
  setComments (state, val) {
    if (val) {
      state.comments = val
    } else {
      state.comments = []
    }
  }
}

// -- posts --
// subject
// img
// content
// authorUid
// authorNickname
// authorAvatar
// createdOn
// modifiedOn
// tags
// likes
// commentsQty
// ratings
// views

// -- comments --
// postID
// content
// fromUid
// fromNickname
// fromAvatar
// createdOn
// modifiedOn
// modifiedBy
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
    await postsCollection.add({
      subject: data.subject,
      content: data.content,
      authorUid: data.uid,
      authorNickname: data.authorNickname,
      createdOn: data.createdOn,
      likes: []
    })
  },
  async updatePostLikes ({ commit, state, rootState }, data) {
    await postsCollection.doc(data.id).update({
      'likes': data.likes
    })
  },
  async createComment ({ commit, state, rootState }, data) {
    await commentsCollection.add({
      postID: data.postID,
      content: data.content,
      fromUid: data.fromUid,
      fromNickname: data.fromNickname,
      createdOn: data.createdOn,
      fromMobileDevice: data.fromMobileDevice,
      replyToID: data.replyToID,
      likes: []
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
