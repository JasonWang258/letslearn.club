import { usersCollection, postsCollection } from '@/firebaseConfig'
// import md5 from 'md5'

const state = {
  currentUser: null,
  userProfile: {}
}

const getters = {
}

const mutations = {
  setCurrentUser (state, val) {
    state.currentUser = val
  },
  setUserProfile (state, val) {
    state.userProfile = val
  }
}

const actions = {
  clearData ({ commit }) {
    commit('setCurrentUser', null)
    commit('setUserProfile', {})
    commit('setDefaultAvatar', '')
  },
  async fetchUserProfile ({ commit, state }) {
    try {
      let response = await usersCollection.doc(state.currentUser.uid).get()
      if (response.data()) {
        commit('setUserProfile', response.data())
      }
    } catch (error) {
      console.log(error)
    }
  },
  async updateProfile ({ commit, state }, data) {
    let nickname = data.name
    let title = data.title
    try {
      await usersCollection.doc(state.currentUser.uid).update({ nickname, title })
      // update all posts and comments to reflect new name
      let docs = await postsCollection.get()
      docs.forEach(async doc => {
        if (doc.authorUid === state.currentUser.uid) {
          doc.update({
            authorNickname: nickname
          })
        }
        let comments = await doc.collection('comments').where('fromUid', '==', state.currentUser.uid).get()
        comments.forEach(comment => {
          comment.update({
            fromNickname: nickname
          })
        })
      })
    } catch (err) {
      console.log(err)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
