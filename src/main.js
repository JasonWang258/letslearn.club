import '@babel/polyfill'
import Vue from 'vue'
import i18n from '@/plugins/i18n'
import '@/plugins/vuetify'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/registerServiceWorker'
import * as firebaseApp from '@/firebaseConfig'
import '@mdi/font/css/materialdesignicons.min.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false

// handle page reloads
let app
let usersUnsubscribe = () => {}
firebaseApp.auth.onAuthStateChanged(user => {
  // realtime updates from our posts collection
  firebaseApp.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
    // check if created by currentUser
    let createdByCurrentUser
    if (user && querySnapshot.docs.length) {
      createdByCurrentUser = user.uid === querySnapshot.docChanges()[0].doc.data().userId
    }
    // add new posts to hiddenPosts array after initial load
    if (querySnapshot.docChanges().length !== querySnapshot.docs.length &&
      querySnapshot.docChanges()[0].type === 'added' && !createdByCurrentUser) {
      let post = querySnapshot.docChanges()[0].doc.data()
      post.id = querySnapshot.docChanges()[0].doc.id
      store.commit('blog/setHiddenPosts', post)
    } else {
      let postsArray = []
      querySnapshot.forEach(doc => {
        let post = doc.data()
        post.id = doc.id
        postsArray.push(post)
      })
      store.commit('blog/setPosts', postsArray)
    }
  })
  if (user) {
    store.commit('users/setCurrentUser', user)
    store.dispatch('users/fetchUserProfile')
    usersUnsubscribe = firebaseApp.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('users/setUserProfile', doc.data())
    })
  } else {
    usersUnsubscribe()
  }
  if (!app) {
    app = new Vue({
      router,
      store,
      i18n,
      render: h => h(App)
    }).$mount('#app')
  }
})
