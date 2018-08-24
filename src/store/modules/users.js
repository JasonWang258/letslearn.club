import { auth, usersCollection, postsCollection, commentsCollection } from '@/firebaseConfig'

const state = {
  currentUser: null,
  userProfile: []
}

const getters = {
  currentUserz: (state) => {
    return auth.currentUser
  }
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
    let name = data.name
    let title = data.title
    try {
      await usersCollection.doc(state.currentUser.uid).update({ name, title })
      // update all posts by user to reflect new name
      let docs = postsCollection.where('userId', '==', state.currentUser.uid).get()
      docs.forEach(doc => {
        postsCollection.doc(doc.id).update({
          userName: name
        })
      })
      // update all comments by user to reflect new name
      let commentsDocs = await commentsCollection.where('userId', '==', state.currentUser.uid).get()
      commentsDocs.forEach(doc => {
        commentsCollection.doc(doc.id).update({
          userName: name
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
