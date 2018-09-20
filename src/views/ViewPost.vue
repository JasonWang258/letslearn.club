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
                          <div class="headline">
                            <v-avatar size="48px" color="orange">
                              <v-icon>business</v-icon>
                            </v-avatar>
                            <span class="ml-4" v-text="currentPost.subject"></span>
                          </div>
                        </v-card-title>
                      </v-flex>
                    </v-layout>
                    <v-layout class="ml-5 pl-5" row wrap justify-space-between>
                      <v-flex d-flex>
                        <span v-text="'Author: ' + currentPost.authorNickname"></span>
                      </v-flex>
                      <v-flex d-flex xs12 sm2 v-if="!isNewPost">
                        <v-layout row justify-end>
                          <v-badge color="red" overlap>
                            <span slot="badge">{{postLikesQty}}</span>
                            <v-btn icon>
                              <v-icon large color="red" @click="addLike">favorite</v-icon>
                            </v-btn>
                          </v-badge>
                          <v-btn icon>
                            <v-icon large>bookmark</v-icon>
                          </v-btn>
                          <v-btn icon>
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
                  <span v-html="$t('message.commentsHeader', { qty: commentsQty })">Comments (x)</span>
                  <v-divider class="mb-3"></v-divider>
                  <v-textarea
                    v-model="newComment"
                    auto-grow
                    box
                    label="leave your comment here"
                    rows="1"
                  ></v-textarea>
                  <div class="right" style="margin-top: -20px;">
                    <v-btn small :disabled="newComment===''" @click="createNewComment">submit</v-btn>
                  </div>
                  <v-divider class="mt-4"></v-divider>
                  <v-list two-line>
                    <template v-for="(item, index) in currentComments">
                      <v-list-tile
                        :key="index"
                        avatar
                      >
                        <v-list-tile-avatar>
                          <img :src="item.fromAvator">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title v-text="item.fromNickname"></v-list-tile-title>
                          <v-list-tile-sub-title><pre v-text="item.content"></pre></v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-icon color="pink">star</v-icon>
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
export default {
  name: 'ViewPost',
  components: {
    'medium-editor': editor
  },
  props: ['post_id'],
  data () {
    return {
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
        fromAvator: 'dsf',
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
      return this.currentPost.likes.length
    },
    commentsQty () {
      return this.currentComments.length
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
    getPost () {
      let post = this.posts.filter(item => {
        return item.id === this.post_id
      })
      if (post.length === 1) {
        this.currentPost = post[0]
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
        replyToID: replyToID // if null -> comment else -> reply
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
