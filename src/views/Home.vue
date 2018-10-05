<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap align-center justify-center>
        <transition name="fade">
          <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
            <p>
              Click to show <span class="new-posts">{{ hiddenPosts.length }}</span>
              new <span v-if="hiddenPosts.length > 1">posts</span><span v-else>post</span>
            </p>
          </div>
        </transition>
        <v-flex xs12 sm10 lg8 xl6 v-for="post in posts" :key="post.id">
          <v-hover>
            <v-card
              slot-scope="{ hover }"
              :class="`elevation-${hover ? 5 : 1}`">
              <v-img
                :class="post.img ? 'white--text' : ''"
                :height="post.img ? '300px' : 'auto'"
                :src="post.img"
              >
                <v-container fill-height fluid class="pa-0">
                  <v-layout fill-height align-end>
                    <v-flex xs12>
                      <v-layout row wrap :class="post.img ? 'shadow-mask pt-3' : 'px-3'">
                        <v-list-tile-avatar>
                          <img :src="post.authorAvatar || defaultAvatar">
                        </v-list-tile-avatar>
                        <v-flex>
                          <span class="title">{{ post.authorNickname }} </span><br>
                          <span class="grey--text">{{ post.createdOn | formatDate }}</span>
                        </v-flex>
                        <v-spacer></v-spacer>
                        <v-layout row align-end justify-end>
                          <v-chip small color="grey darken-1" class="mr-3" v-if="post.numberViews">
                            <v-avatar class="grey darken-2"><v-icon small color="grey lighten-2">mdi-eye</v-icon></v-avatar>
                            <span class="white--text" v-html="$tc('message.views', post.numberViews, { count: post.numberViews })"></span>
                          </v-chip>
                          <v-chip small color="grey darken-1" class="mr-3" v-if="post.numberComments">
                            <v-avatar class="grey darken-2"><v-icon small color="grey lighten-2">mdi-comment-text</v-icon></v-avatar>
                            <span class="white--text" v-html="$tc('message.comments', post.numberComments, { count: post.numberComments })"></span>
                          </v-chip>
                          <v-chip small color="grey darken-1" v-if="post.likes.length">
                            <v-avatar class="grey darken-2"><v-icon small color="grey lighten-2">favorite</v-icon></v-avatar>
                            <span class="white--text" v-html="$tc('message.likes', post.likes.length, { count: post.likes.length })"></span>
                          </v-chip>
                        </v-layout>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-img>
              <v-card-title>
                <v-container fill-height fluid>
                  <v-layout row wrap fill-height>
                    <v-flex xs12 align-end flexbox class="mb-2">
                      <span class="display-1">{{ post.subject }}</span>
                    </v-flex>
                    <v-flex xs12 flexbox>
                      <v-layout>
                        <v-spacer></v-spacer>
                        <span class="grey--text">{{ $t('message.rating') }}:&nbsp;</span>
                        <v-progress-circular
                          indeterminate
                          color="orange"
                          v-if="currentLoading === post.id"
                          size="26"
                        ></v-progress-circular>
                        <v-rating
                          v-model="post.averageRating"
                          dense
                          hover
                          size="20"
                          :readonly="readonlyList[post.id]"
                        >
                          <v-icon
                            slot="item"
                            slot-scope="props"
                            :color="props.isFilled ? 'yellow darken-3' : 'grey darken-1'"
                            @click="updateRating(post.id, props.index)"
                          >
                            {{ props.isFilled ? 'mdi-star-circle' : 'mdi-circle-outline' }}
                          </v-icon>
                        </v-rating>
                        <span class="grey--text text--lighten-2 caption mr-2" v-if="!!post.averageRating">
                          ({{ post.averageRating | formatNumber }})
                        </span>
                      </v-layout>
                      <v-divider class="mb-3"></v-divider>
                    </v-flex>
                    <v-flex xs12 flexbox>
                      <div class="subheading" v-html="$options.filters.trimLength(post.content)"></div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="orange" @click="viewPost(post.id)">{{ $t('message.readMore') }}...</v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-flex>
        <div v-if="!posts.length">
            <p class="no-results">Loading... Please wait</p>
        </div>
        <transition name="fade">
          <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
            <p>
              Click to show <span class="new-posts">{{ hiddenPosts.length }}</span>
              new <span v-if="hiddenPosts.length > 1">posts</span><span v-else>post</span>
            </p>
          </div>
        </transition>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import filters from '@/filters'

export default {
  mixins: [filters],
  data () {
    return {
      // defaultAvatar: require('@/assets/default_avatar.svg'),
      defaultAvatar: 'https://www.gravatar.com/avatar/00000000000?d=mp&r=g',
      currentLoading: '',
      readonlyList: {}
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser,
      posts: state => state.blog.posts,
      hiddenPosts: state => state.blog.hiddenPosts,
      comments: state => state.blog.comments
    })
  },
  methods: {
    showNewPosts () {
      let updatedPostsArray = this.hiddenPosts.concat(this.posts)
      // clear hiddenPosts array and update posts array
      this.$store.commit('setHiddenPosts', null)
      this.$store.commit('setPosts', updatedPostsArray)
    },
    viewPost (id) {
      this.$router.push(`/p/${id}`)
    },
    async updateRating (postID, index) {
      console.log(this.currentUser)
      if (!this.currentUser) {
        this.$router.push('user/login')
        return
      }
      this.currentLoading = postID
      await this.$store.dispatch('blog/addRating', {
        'postID': postID,
        'rating': {
          'value': index + 1
        }
      })
      // disable rating
      let obj = {}
      obj[postID] = true
      this.readonlyList = {...obj, ...this.readonlyList}
      this.currentLoading = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.v-chip .v-avatar {
    height: 24px !important;
    margin-left: -12px;
    margin-right: 8px;
    width: 24px !important;
}
.v-chip--small {
    height: 20px;
}
</style>
