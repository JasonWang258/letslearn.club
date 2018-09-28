// import firebase from 'firebase/app'
import { db, postsCollection, commentsCollection } from '@/firebaseConfig'

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
// averageRating
// numberRatings
// ratings
// numberViews
// numberComments

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
    postsCollection.doc(data.postID).update({
      'numberComments': data.numberComments
    })
  },
  async addRating ({ commit, state, dispatch, rootState }, data) {
    let postDocument = postsCollection.doc(data.postID)
    let currentUserRating = postDocument.collection('ratings').doc(rootState.users.currentUser.uid)
    let currentUserRatingSnapshot = await currentUserRating.get()
    if (currentUserRatingSnapshot.exists) {
      dispatch('showSnackbar', {
        message: 'We\'ve got your rating already.',
        color: 'warning'
      }, { root: true })
      return 'rating exists'
    }
    await currentUserRating.set(data.rating)
    db.runTransaction(async function (transaction) {
      let postDoc = await transaction.get(postDocument)
      let postDocData = postDoc.data()
      let newAverage = ((postDocData.numberRatings || 0) *
                       (postDocData.averageRating || 0) + data.rating.value) /
                       ((postDocData.numberRatings || 0) + 1)
      return transaction.update(postDocument, {
        numberRatings: (postDocData.numberRatings || 0) + 1,
        averageRating: newAverage
      })
    })
  },
  addViews ({commit, state, rootState}, data) {
    postsCollection.doc(data.postID).update({
      'numberViews': data.numberViews
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
