<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <p>{{ posts }}</p>
        <p>{{ hiddenPosts }}</p>
        <p>{{ comments }}</p>
        <div v-if="posts.length">
          <div v-for="post in posts" :key="post.id" class="post">
              <h5>{{ post.authorNickname }}</h5>
              <span>{{ post.createdOn | formatDate }}</span>
              <p>{{ post.content | trimLength }}</p>
              <ul>
                  <li><a>likes {{ post.likes }}</a></li>
                  <li><a>view full post</a></li>
              </ul>
          </div>
        </div>
        <div v-else>
            <p class="no-results">There are currently no posts</p>
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
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'
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
    }
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return moment(date).fromNow()
    },
    trimLength(val) {
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
