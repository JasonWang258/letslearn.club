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
              :class="`elevation-${hover ? 12 : 2}`">
              <v-img
                :class="post.img ? 'white--text' : ''"
                :height="post.img ? '200px' : '60px'"
                :src="post.img"
              >
                <v-container fill-height fluid :class="post.img ? '' : 'pb-0'">
                  <v-layout fill-height align-end>
                    <v-flex xs12>
                      <v-layout>
                        <v-list-tile-avatar>
                          <img :src="post.authorAvatar || defaultAvatar">
                        </v-list-tile-avatar>
                        <v-flex>
                          <span class="title">{{ post.authorNickname }} </span><br>
                          <span class="grey--text">{{ post.createdOn | formatDate }}</span>
                        </v-flex>
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
                        <span class="grey--text">Tags:</span>
                        <v-spacer></v-spacer>
                        <v-rating
                          v-model="post.rating"
                          background-color="grey darken-1"
                          color="yellow darken-3"
                          dense
                          half-increments
                          hover
                          size="20"
                          @click="console.log('df')"
                        ></v-rating>
                      </v-layout>
                      <v-divider class="mb-3"></v-divider>
                    </v-flex>
                    <v-flex xs12 flexbox>
                      <p class="subheading">{{ post.content | trimLength }}</p>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <span>25 views</span>
                <span>2 comments</span>
                <v-btn flat color="orange">likes {{ post.likes.length }}</v-btn>
                <v-btn flat color="orange" @click="viewPost(post.id)">Read More...</v-btn>
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
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { mapState } from 'vuex'
dayjs.extend(relativeTime)
export default {
  data () {
    return {
      defaultAvatar: require('@/assets/default_avatar.svg')
    }
  },
  computed: {
    ...mapState({
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
    }
  },
  filters: {
    formatDate (val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return dayjs(date).fromNow()
    },
    trimLength (val) {
      if (val.length < 200) {
        return val
      }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
