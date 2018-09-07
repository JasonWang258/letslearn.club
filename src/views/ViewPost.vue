<template>
  <v-container>
    <v-layout>
      <v-flex>
        <div>post {{ post_id }}</div>
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
                              <span class="ml-4">Title</span>
                            </div>
                          </v-card-title>
                        </v-flex>
                      </v-layout>
                      <v-divider light inset></v-divider>
                      <v-card-text>
                        <medium-editor
                        v-show="allowEdit"
                        :text="lorem"
                        :options="editorOptions"
                        @editorCreated="getMediumEditor"></medium-editor>
                        <div
                          v-show="!allowEdit"
                          v-html="lorem"
                        ></div>
                      </v-card-text>
                    </v-card>
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
// import Prism from 'prismjs'
import 'prismjs/themes/prism-okaidia.css'
export default {
  name: 'ViewPost',
  components: {
    'medium-editor': editor
  },
  props: ['post_id'],
  data () {
    return {
      allowEdit: true,
      mediumEditorApi: null,
      lorem: 'var i = 5;',
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
    activeFab () {
      return this.allowEdit ? { 'color': 'pink', icon: 'save' } : { 'color': 'indigo', icon: 'edit' }
    }
  },
  mounted () {
    console.log(this.post_id)
  },
  methods: {
    editPost () {
      console.log('edit')
      if (this.allowEdit) {
        let htmlContent = this.mediumEditorApi.getContent(0)
        this.lorem = htmlContent
        this.$store.dispatch('blog/createPost', {
          content: htmlContent,
          uid: this.currentUserz.uid
        })
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
