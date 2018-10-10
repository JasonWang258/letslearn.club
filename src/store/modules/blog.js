import firebase from 'firebase/app'
import { db, storage, postsCollection, mediaCollection } from '@/firebaseConfig'

const state = {
  posts: [],
  hiddenPosts: [],
  comments: [],
  fileUploaded: {}
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
  },
  setFileUploaded (state, val) {
    if (val) {
      state.fileUploaded = {...state.fileUploaded, ...val}
    } else {
      state.fileUploaded = {}
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
// replyToID // if null -> comment, else -> reply
// likes

// -- users --
// nickName
// bookmarks
// avatar
// roles

const actions = {
  async createPost ({ commit, state, rootState }, data) {
    await postsCollection.add({
      subject: data.subject,
      content: data.content,
      img: data.img,
      authorUid: data.uid,
      authorNickname: data.authorNickname,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(), // data.createdOn,
      likes: []
    })
  },
  async updatePost ({ commit, state, rootState }, data) {
    await postsCollection.doc(data.id).update({
      subject: data.subject,
      content: data.content,
      img: data.img,
      modifiedOn: firebase.firestore.FieldValue.serverTimestamp() // data.modifiedOn
    })
  },
  async updatePostLikes ({ commit, state, rootState }, data) {
    await postsCollection.doc(data.id).update({
      'likes': data.likes
    })
  },
  async updateCommentLikes ({ commit, state, rootState }, data) {
    await postsCollection.doc(data.postID).collection('comments').doc(data.id).update({
      'likes': data.likes
    })
  },
  async createComment ({ commit, state, dispatch, rootState }, data) {
    let postDocument = postsCollection.doc(data.postID)
    let currentComment = postDocument.collection('comments').doc()
    await currentComment.set({
      content: data.content,
      fromUid: data.fromUid,
      fromNickname: data.fromNickname,
      createdOn: firebase.firestore.FieldValue.serverTimestamp(), // data.createdOn,
      fromMobileDevice: data.fromMobileDevice,
      replyToID: data.replyToID,
      indent: data.indent,
      likes: []
    })
    db.runTransaction(async function (transaction) {
      let postDoc = await transaction.get(postDocument)
      let postDocData = postDoc.data()
      return transaction.update(postDocument, {
        numberComments: (postDocData.numberComments || 0) + 1
      })
    })
  },
  async addRating ({ commit, state, dispatch, rootState }, data) {
    let postDocument = postsCollection.doc(data.postID)
    let currentUserRating = postDocument.collection('ratings').doc(rootState.users.currentUser.uid)
    let currentUserRatingSnapshot = await currentUserRating.get()
    if (currentUserRatingSnapshot.exists) {
      dispatch('showSnackbar', {
        message: 'We\'ve got your rating already.',
        timeout: 3000,
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
  },
  async uploadImage ({commit, state, dispatch, rootState}, imageFile) {
    try {
      var imageRef = storage.ref().child('images')
      var targetFileRef = imageRef.child(imageFile.name)
      var uploadTask = targetFileRef.put(imageFile)
      uploadTask.on('state_changed', function (snapshot) {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        commit('setFileUploaded', { progress: progress, state: snapshot.state })
      }, function (error) {
        // Handle unsuccessful uploads
        console.log(error)
        commit('setFileUploaded', { error: error })
      }, function () {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          commit('setFileUploaded', { downloadURL: downloadURL, success: true })
          dispatch('updateMediaCollection', {
            name: imageFile.name,
            src: downloadURL,
            path: uploadTask.snapshot.metadata.fullPath
          })
        })
      })
    } catch (error) {
      commit('setFileUploaded', { error: error })
    }
  },
  async updateMediaCollection ({ commit, state, rootState }, data) {
    await mediaCollection.doc(data.name).set({
      src: data.src,
      path: data.path
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
