<template>
  <v-container class="pt-0">
    <v-layout xs12 sm10 lg8 xl6>
      <v-flex>
        <v-card raised class="post-view">
          <div class="toolbox" v-if="allowEdit">
            <v-slide-x-reverse-transition>
              <img-form
                v-model="showImgForm"
                :originalImg="currentPost.img"
                @newImage="showNewImg"
                v-show="isEditMode"
              ></img-form>
            </v-slide-x-reverse-transition>
            <v-fab-transition>
              <v-btn
                :color="activeFab.color"
                :key="activeFab.icon"
                dark
                fab
                @click="editPost"
              >
                <v-icon>{{ activeFab.icon }}</v-icon>
              </v-btn>
            </v-fab-transition>
          </div>
          <v-layout row wrap>
            <v-flex d-flex xs12>
              <v-layout column>
                <v-flex d-flex>
                  <v-card tile flat>
                    <v-img
                      :class="currentPost.img ? 'white--text' : ''"
                      :height="currentPost.img ? '400px' : 'auto'"
                      :src="currentPost.img"
                    >
                      <v-container fill-height fluid class="pa-0">
                        <v-layout fill-height align-end>
                          <v-flex xs12>
                            <v-layout row wrap :class="currentPost.img ? 'shadow-mask' : 'px-3'">
                              <v-flex d-flex xs12>
                                <v-card-title primary-title>
                                  <v-layout row class="display-3">
                                    <div v-text="currentPost.subject" v-show="!isEditMode"></div>
                                    <v-text-field
                                      label="Subject"
                                      placeholder="put your subjet here..."
                                      v-model="currentPost.subject"
                                      v-show="isEditMode"
                                      dark
                                    ></v-text-field>
                                  </v-layout>
                                </v-card-title>
                              </v-flex>
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
                                  <v-btn icon @click="addToBookmark">
                                    <v-icon large color="indigo lighten-2">bookmark</v-icon>
                                  </v-btn>
                                  <v-btn icon @click="showShareDialog=true">
                                    <v-icon large color="indigo lighten-2">share</v-icon>
                                  </v-btn>
                                  <v-badge color="red" overlap>
                                    <span slot="badge">{{postLikesQty}}</span>
                                    <v-btn icon @click="addLike">
                                      <v-icon large color="red">favorite</v-icon>
                                    </v-btn>
                                  </v-badge>
                                </v-layout>
                              </v-flex>
                            </v-layout>
                          </v-flex>
                        </v-layout>
                      </v-container>
                    </v-img>
                    <v-divider light inset></v-divider>
                    <v-container>
                      <v-layout>
                        <v-card-text>
                          <medium-editor
                          v-show="isEditMode"
                          :text="currentPost.content"
                          :options="editorOptions"
                          @editorCreated="getMediumEditor"></medium-editor>
                          <div
                            v-show="!isEditMode"
                            v-html="currentPost.content"
                          ></div>
                        </v-card-text>
                      </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
        <v-card raised class="pa-4 mt-5 post-view">
          <v-layout row wrap>
            <v-flex v-if="!isNewPost">
              <span v-html="$t('message.commentsHeader', { count: currentPost.numberComments })"></span>
              <v-divider class="mb-3"></v-divider>
              <v-layout>
                <v-flex xs12>
                  <comment-form
                    :post-id="currentPost.id">
                  </comment-form>
                </v-flex>
              </v-layout>
              <v-list three-line>
                <template v-for="(item, index) in comments">
                  <v-layout :key="index" row wrap :class="'indent-' + (item.indent || 0)">
                    <v-flex xs12>
                      <v-divider class="mt-4"></v-divider>
                    </v-flex>
                    <v-flex xs12>
                      <v-list-tile avatar>
                        <v-list-tile-avatar>
                          <img :src="item.fromAvatar || defaultAvatar">
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title><span v-text="item.fromNickname"></span><span class="grey--text"></span>:</v-list-tile-title>
                          <v-list-tile-sub-title>{{ item.createdOn | formatDate }}</v-list-tile-sub-title>
                          <pre v-text="item.content"></pre>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-layout row wrap>
                            <v-chip small class="mr-3 mt-3" @click="addCommentLikes(item)">
                              <v-avatar class="grey lighten-1"><v-btn icon><v-icon small color="grey lighten-5">mdi-thumb-up</v-icon></v-btn></v-avatar>
                              <span v-html="$tc('message.ups', item.likes.length, { count: item.likes.length})"></span>
                            </v-chip>
                            <v-chip small class="mt-3" @click="showCommentForm = showCommentForm === item.id ? '' : item.id">
                              <v-avatar class="grey lighten-1"><v-btn icon><v-icon small color="grey lighten-5">reply</v-icon></v-btn></v-avatar>
                              <span v-text="$tc('message.replyComment')"></span>
                            </v-chip>
                          </v-layout>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-flex>
                    <v-flex xs12 v-if="showCommentForm === item.id" class="pl-5">
                      <comment-form
                        :post-id="currentPost.id"
                        :reply-to-id="item.id"
                        :indent="(item.indent || 0) + 1"
                        @commentDone="showCommentForm = ''">
                      </comment-form>
                    </v-flex>
                  </v-layout>
                </template>
              </v-list>
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
import { postsCollection } from '@/firebaseConfig'
import 'medium-editor/dist/css/medium-editor.min.css'
import 'medium-editor/dist/css/themes/tim.min.css'
import extensions from '@/plugins/mediumEditor/extension'
import 'prismjs/themes/prism-okaidia.css'
import filters from '@/filters'
import ShareDialog from '@/components/ShareDialog'
import CommentForm from '@/components/CommentForm'
import ImgForm from '@/components/ImgForm'

export default {
  mixins: [filters],
  name: 'ViewPost',
  components: {
    'medium-editor': editor,
    'ShareDialog': ShareDialog,
    'CommentForm': CommentForm,
    'ImgForm': ImgForm
  },
  props: ['post_id'],
  data () {
    return {
      currentUrl: window.location.href,
      showShareDialog: false,
      showCommentForm: '',
      showImgForm: false,
      defaultAvatar: 'https://www.gravatar.com/avatar/00000000000?d=mp&r=g',
      originalPost: null,
      currentPost: {
        subject: '',
        content: '',
        authorUid: '',
        authorNickname: '',
        createdOn: null,
        modifiedOn: null,
        likes: []
      },
      newComment: '',
      isEditMode: false,
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
    allowEdit () {
      if (!this.userProfile.roles) {
        return false
      }
      return this.userProfile.roles.admin || (this.userProfile.roles.writer && this.currentUser.uid === this.currentPost.id)
    },
    postChanged () {
      return this.currentPost.subject !== this.originalPost.subject ||
             this.currentPost.content !== this.originalPost.content ||
             this.currentPost.img !== this.originalPost.img
    },
    isNewPost () {
      return this.post_id === 'new'
    },
    postLikesQty () {
      return this.currentPost ? this.currentPost.likes.length : 0
    },
    activeFab () {
      return this.isEditMode ? { 'color': 'pink', icon: 'save' } : { 'color': 'indigo', icon: 'edit' }
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
    }
  },
  beforeMount () {
    if (this.isNewPost) {
      return
    }
    this.commentsUnsubscribe = postsCollection.doc(this.post_id).collection('comments').orderBy('createdOn', 'asc').onSnapshot(querySnapshot => {
      let commentsArray = []
      querySnapshot.forEach(doc => {
        let comment = doc.data()
        comment.id = doc.id
        if (comment.replyToID) {
          let replyToIndex = commentsArray.findIndex(item => item.id === comment.replyToID)
          commentsArray.splice(replyToIndex + 1, 0, comment)
        } else {
          commentsArray.unshift(comment)
        }
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
  },
  methods: {
    editPost () {
      let htmlContent = this.mediumEditorApi.getContent(0)
      this.currentPost.content = htmlContent
      if (this.isEditMode && this.postChanged) {
        if (this.isNewPost) {
          this.$store.dispatch('blog/createPost', {
            subject: this.currentPost.subject,
            content: htmlContent,
            img: currentPost.img,
            uid: this.currentUser.uid,
            authorNickname: this.userProfile.nickname,
            createdOn: new Date()
          })
        } else {
          this.$store.dispatch('blog/updatePost', {
            id: this.currentPost.id,
            subject: this.currentPost.subject,
            content: htmlContent,
            img: this.currentPost.img,
            modifiedOn: new Date()
          })
        }
      }
      this.isEditMode = !this.isEditMode
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
    addCommentLikes (item) {
      if (!this.currentUser) {
        // todo: save current path (this.$route.fullPath)
        this.$router.push('/user/login')
        return
      }
      if (item.likes.includes(this.currentUser.uid)) {
        return false
      }
      item.likes.push(this.currentUser.uid)
      this.$store.dispatch('blog/updateCommentLikes', {
        postID: this.currentPost.id,
        id: item.id,
        likes: item.likes
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
      this.originalPost = this.posts.find(item => {
        return item.id === this.post_id
      })
      if (this.originalPost) {
        this.currentPost = {...this.originalPost}
      }
    },
    showNewImg (value) {
      this.currentPost.img = value
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.post-view {
  font-size: 1.5em;
}
code:after, kbd:after, code:before, kbd:before {
  content: "";
  letter-spacing: -1px;
}
@for $i from 1 through 8 {
  .indent-#{$i} {
    margin-left: 0px + 40*$i;
  }
}
.toolbox {
  border-radius: 10px !important;
  background-color: bisque;
  text-align: right;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}
</style>
