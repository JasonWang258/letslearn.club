<template>
  <v-container>
    <v-layout xs12 sm10 lg8 xl6>
      <v-flex>
        <div> post {{ post_id }}</div>
        <v-card raised class="pa-4 mt-2 post-view">
          <v-fab-transition>
            <v-btn
              :color="activeFab.color"
              :key="activeFab.icon"
              dark
              fab
              absolute
              top
              right
              @click="editPost"
            >
              <v-icon>{{ activeFab.icon }}</v-icon>
            </v-btn>
          </v-fab-transition>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-layout column>
                <v-flex d-flex>
                  <v-card tile flat>
                    <v-layout row wrap>
                      <v-flex d-flex>
                        <v-card-title primary-title>
                          <v-layout row class="headline">
                            <div v-text="currentPost.subject" v-show="!allowEdit"></div>
                            <v-text-field
                              label="Subject"
                              placeholder="put your subjet here..."
                              v-model="currentPost.subject"
                              v-show="allowEdit"
                            ></v-text-field>
                          </v-layout>
                        </v-card-title>
                      </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                      <v-flex d-flex >
                        <v-layout class="body-1">
                          <v-list-tile avatar>
                            <v-list-tile-avatar>
                              <img :src="currentPost.authorAvatar || defaultAvatar">
                            </v-list-tile-avatar>
                            <v-list-tile-content>
                              <v-list-tile-title><span v-text="currentPost.authorNickname"></span></v-list-tile-title>
                              <v-list-tile-sub-title>{{ currentPost.createdOn | formatDate }}</v-list-tile-sub-title>
                            </v-list-tile-content>
                          </v-list-tile>
                        </v-layout>
                      </v-flex>
                      <v-spacer></v-spacer>
                      <v-flex d-flex xs12 sm2 v-if="!isNewPost">
                        <v-layout row justify-end>
                          <v-badge color="red" overlap>
                            <span slot="badge">{{postLikesQty}}</span>
                            <v-btn icon @click="addLike">
                              <v-icon large color="red">favorite</v-icon>
                            </v-btn>
                          </v-badge>
                          <v-btn icon @click="addToBookmark">
                            <v-icon large>bookmark</v-icon>
                          </v-btn>
                          <v-btn icon @click="showShareDialog=true">
                            <v-icon large>share</v-icon>
                          </v-btn>
                        </v-layout>
                      </v-flex>
                    </v-layout>
                    <v-divider light inset></v-divider>
                    <v-card-text>
                      <medium-editor
                      v-show="allowEdit"
                      :text="currentPost.content"
                      :options="editorOptions"
                      @editorCreated="getMediumEditor"></medium-editor>
                      <div
                        v-show="!allowEdit"
                        v-html="currentPost.content"
                      ></div>
                    </v-card-text>
                  </v-card>
                </v-flex>
                <v-flex v-if="!isNewPost">
                  <span v-html="$t('message.commentsHeader', { count: commentsQty })"></span>
                  <v-divider class="mb-3"></v-divider>
                  <v-textarea
                    v-model="newComment"
                    auto-grow
                    box
                    label="leave your comment here"
                    rows="1"
                  ></v-textarea>
                  <div class="right" style="margin-top: -20px;">
                    <v-btn small :disabled="newComment===''" @click="createNewComment" v-text="$tc('message.submitComment')"></v-btn>
                  </div>
                  <v-divider class="mt-4"></v-divider>
                  <v-list two-line>
                    <template v-for="(item, index) in currentComments">
                      <v-list-tile
                        :key="index"
                        avatar
                      >
                        <v-list-tile-avatar>
                          <img :src="item.fromAvatar || defaultAvatar">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title><span v-text="item.fromNickname"></span>&nbsp;<span class="grey--text">said:</span></v-list-tile-title>
                          <v-list-tile-sub-title>{{ item.createdOn | formatDate }}</v-list-tile-sub-title>
                          <pre v-text="item.content"></pre>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-layout row>
                            <v-chip small class="mr-3 mt-3">
                              <v-avatar class="grey"><v-btn icon><v-icon small color="grey lighten-5">mdi-thumb-up</v-icon></v-btn></v-avatar>
                              <span v-html="$tc('message.ups', item.numberUps || 0, { count: item.numberUps })"></span>
                            </v-chip>
                            <v-chip small class="mt-3" @click="">
                              <v-avatar class="grey"><v-btn icon><v-icon small color="grey lighten-5">reply</v-icon></v-btn></v-avatar>
                              <span v-text="$tc('message.replyComment')"></span>
                            </v-chip>
                          </v-layout>
                        </v-list-tile-action>
                      </v-list-tile>
                    </template>
                  </v-list>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <share-dialog :url="currentUrl" v-model="showShareDialog"></share-dialog>
  </v-container>
</template>

<script>
import editor from 'vue2-medium-editor'
import { mapState } from 'vuex'
import { commentsCollection } from '@/firebaseConfig'
import 'medium-editor/dist/css/medium-editor.min.css'
import 'medium-editor/dist/css/themes/tim.min.css'
import extensions from '@/plugins/mediumEditor/extension'
import 'prismjs/themes/prism-okaidia.css'
import filters from '@/filters'
import ShareDialog from '@/components/ShareDialog'

export default {
  mixins: [filters],
  name: 'ViewPost',
  components: {
    'medium-editor': editor,
    'ShareDialog': ShareDialog
  },
  props: ['post_id'],
  data () {
    return {
      currentUrl: window.location.href,
      showShareDialog: false,
      defaultAvatar: require('@/assets/default_avatar.svg'),
      currentPost: {
        subject: '',
        content: '',
        authorUid: '',
        authorNickname: '',
        createdOn: null,
        modifiedOn: null,
        likes: []
      },
      currentComments: [{
        postID: '',
        content: 'test comment',
        fromUid: 'DXcwDoaOgkWU86q8r8loVf4k5B02',
        fromNickname: 'testUser',
        fromAvatar: 'dsf',
        createdOn: '',
        modifiedOn: '',
        fromDevice: '',
        atUid: '',
        atNickname: '',
        replyToID: null, // if null -> comment else -> reply
        likes: []
      }],
      newComment: '',
      allowEdit: true,
      mediumEditorApi: null,
      editorOptions: {
        buttonLabels: 'fontawesome',
        toolbar: {
          buttons: [
            'bold',
            'italic',
            'underline',
            'anchor',
            {
              name: 'image',
              action: 'image',
              aria: 'image',
              tagNames: ['img'],
              contentDefault: '<b>image</b>',
              contentFA: '<i class="fa fa-image"></i>'
            },
            'orderedlist',
            'unorderedlist',
            'justifyLeft',
            'justifyCenter',
            'justifyRight',
            {
              name: 'h2',
              action: 'append-h2',
              aria: 'header type two',
              tagNames: ['h2'],
              contentDefault: '<b>H2</b>',
              contentFA: '<i class="fa fa-heading"><sup>2</sup></i>'
            },
            {
              name: 'h3',
              action: 'append-h3',
              aria: 'header type three',
              tagNames: ['h3'],
              contentDefault: '<b>H3</b>',
              contentFA: '<i class="fa fa-heading"><sup>3</sup></i>'
            },
            'quote',
            'highlighter',
            'code'
          ]
        },
        extensions: {
          'highlighter': new extensions.HighlighterButton(),
          'code': new extensions.CodeForm()
        }
      }
    }
  },
  computed: {
    ...mapState({
      isDarkTheme: state => state.isDarkTheme,
      currentUser: state => state.users.currentUser,
      userProfile: state => state.users.userProfile,
      posts: state => state.blog.posts,
      comments: state => state.blog.comments
    }),
    isNewPost () {
      return this.post_id === 'new'
    },
    postLikesQty () {
      return this.currentPost ? this.currentPost.likes.length : 0
    },
    commentsQty () {
      return this.currentComments ? this.currentComments.length : 0
    },
    activeFab () {
      return this.allowEdit ? { 'color': 'pink', icon: 'save' } : { 'color': 'indigo', icon: 'edit' }
    }
  },
  watch: {
    posts: function (val, oldVal) {
      if (this.isNewPost) {
        return
      }
      this.getPost()
      if (!this.currentPost.id) {
        this.$router.replace('/404')
      }
    },
    comments: function (val, oldVal) {
      if (this.isNewPost) {
        return
      }
      this.getComments()
    }
  },
  beforeMount () {
    if (this.isNewPost) {
      return
    }
    this.commentsUnsubscribe = commentsCollection.where('postID', '==', this.post_id).orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
      let commentsArray = []
      querySnapshot.forEach(doc => {
        let comment = doc.data()
        comment.id = doc.id
        commentsArray.push(comment)
      })
      this.$store.commit('blog/setComments', commentsArray)
    })
  },
  beforeDestroy () {
    if (this.commentsUnsubscribe) {
      this.commentsUnsubscribe()
    }
  },
  created () {
    if (this.isNewPost) {
      return
    }
    this.getPost()
    // views + 1
    if (this.currentPost.id) {
      this.$store.dispatch('blog/addViews', {
        'postID': this.currentPost.id,
        'numberViews': this.currentPost.numberViews ? this.currentPost.numberViews + 1 : 1
      })
    }
    this.getComments()
  },
  methods: {
    editPost () {
      if (this.allowEdit) {
        let htmlContent = this.mediumEditorApi.getContent(0)
        this.currentPost.content = htmlContent
        if (this.isNewPost) {
          this.$store.dispatch('blog/createPost', {
            subject: this.currentPost.subject,
            content: htmlContent,
            uid: this.currentUser.uid,
            authorNickname: this.userProfile.nickname,
            createdOn: new Date()
          })
        }
      }
      this.allowEdit = !this.allowEdit
    },
    getMediumEditor (api) {
      this.mediumEditorApi = api
    },
    addLike () {
      if (!this.currentUser) {
        // todo: save current path (this.$route.fullPath)
        this.$router.push('/user/login')
        return
      }
      if (this.currentPost.likes.includes(this.currentUser.uid)) {
        return false
      }
      this.currentPost.likes.push(this.currentUser.uid)
      this.$store.dispatch('blog/updatePostLikes', {
        id: this.currentPost.id,
        likes: this.currentPost.likes
      })
    },
    addToBookmark () {
      if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
        window.sidebar.addPanel(document.title, window.location.href, '')
      } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
        window.external.AddFavorite(location.href, document.title)
      } else if (window.opera && window.print) { // Opera Hotlist
        this.title = document.title
        return true
      } else { // webkit - safari/chrome
        let message = 'To bookmark this page, please press ' + (navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Command/Cmd' : 'CTRL') + ' + D'
        this.$store.dispatch('showSnackbar', {
          message: message,
          color: 'warning'
        })
      }
    },
    getPost () {
      let post = this.posts.find(item => {
        return item.id === this.post_id
      })
      if (post) {
        this.currentPost = post
      }
    },
    createNewComment (e, replyToID = '') {
      if (!this.currentUser) {
        // todo: save current path (this.$route.fullPath)
        this.$router.push('/user/login')
        return
      }
      let isMobile = navigator.userAgent.includes('Mobile')
      this.$store.dispatch('blog/createComment', {
        postID: this.currentPost.id,
        content: this.newComment,
        fromUid: this.currentUser.uid,
        fromNickname: this.userProfile.nickname,
        createdOn: new Date(),
        fromMobileDevice: isMobile,
        replyToID: replyToID, // if null -> comment else -> reply
        numberComments: this.currentPost.numberComments ? this.currentPost.numberComments + 1 : 1
      })
      this.newComment = ''
    },
    getComments () {
      this.currentComments = this.comments.filter(item => {
        return item.postID === this.post_id
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.post-view {
  font-size: 1.5em;
}
code:after, kbd:after, code:before, kbd:before {
  content: "";
  letter-spacing: -1px;
}
</style>
