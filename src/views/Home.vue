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
                class="white--text"
                height="200px"
                src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
              >
                <v-container fill-height fluid>
                  <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                      <span class="headline">{{ post.subject }}</span>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-img>
              <v-card-title>
                <div>
                  <span class="grey--text">{{ post.authorNickname }} {{ post.createdOn | formatDate }}</span><br>
                  <p>{{ post.content | trimLength }}</p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
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
