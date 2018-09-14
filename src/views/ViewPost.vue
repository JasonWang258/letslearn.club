<template>
  <v-container>
    <v-layout>
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
                              <span slot="badge">6</span>
                              <v-btn icon>
                                <v-icon large>favorite</v-icon>
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
                      v-model="comment"
                      auto-grow
                      box
                      label="leave your comment here"
                      rows="1"
                    ></v-textarea>
                    <div class="right" style="margin-top: -20px;">
                      <v-btn small>submit</v-btn>
                    </div>
                    <v-divider class="mt-4"></v-divider>
                    <v-list two-line>
                      <template v-for="(item, index) in comments">
                        <v-list-tile
                          :key="index"
                          avatar
                        >
                          <v-list-tile-avatar>
                            <img :src="item.fromAvator">
                          </v-list-tile-avatar>

                          <v-list-tile-content>
                            <v-list-tile-title v-text="item.fromNickname"></v-list-tile-title>
                            <v-list-tile-sub-title v-text="item.content"></v-list-tile-sub-title>
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
import { mapState, mapGetters } from 'vuex'
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
      comments: [{
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
      comment: '',
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
      userProfile: state => state.users.userProfile
    }),
    ...mapGetters({
      currentUserz: 'users/currentUserz'
    }),
    isNewPost () {
      return this.post_id === 'new'
    },
    commentsQty () {
      return 4
    },
    activeFab () {
      return this.allowEdit ? { 'color': 'pink', icon: 'save' } : { 'color': 'indigo', icon: 'edit' }
    }
  },
  mounted () {
    console.log(this.currentUserz)
    if (isNewPost) {
      return
    }
    // getPost(this.post_id)
    // getComments(this.post_id)
  },
  methods: {
    editPost () {
      if (this.allowEdit) {
        let htmlContent = this.mediumEditorApi.getContent(0)
        this.currentPost.content = htmlContent
        if (isNewPost) {
          this.$store.dispatch('blog/createPost', {
            subject: this.currentPost.subject,
            content: htmlContent,
            uid: this.currentUserz.uid,
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
    createNewPost () {
      console.log('create new post')
    },
    getPost () {
      console.log('get post')
    },
    getComments () {
      console.log('get Comments')
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
