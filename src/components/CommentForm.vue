<template>
  <div class="ml-3">
    <v-textarea
      v-model="newComment"
      auto-grow
      box
      label="leave your comment here"
      rows="1"
    ></v-textarea>
    <div class="right">
      <v-btn small :disabled="newComment===''" @click="createNewComment" v-text="$tc('message.submitComment')"></v-btn>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'CommentForm',
  props: {
    postId: String,
    replyToId: {
      default: null,
      type: String
    },
    indent: {
      default: 0,
      type: Number
    }
  },
  data () {
    return {
      newComment: ''
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser,
      userProfile: state => state.users.userProfile
    })
  },
  methods: {
    createNewComment () {
      if (!this.currentUser.uid) {
        // todo: save current path (this.$route.fullPath)
        this.$router.push('/user/login')
        return
      }
      let isMobile = navigator.userAgent.includes('Mobile')
      this.$store.dispatch('blog/createComment', {
        postID: this.postId,
        content: this.newComment,
        fromUid: this.currentUser.uid,
        fromNickname: this.userProfile.nickname,
        createdOn: new Date(),
        fromMobileDevice: isMobile,
        replyToID: this.replyToId, // if null -> comment else -> reply
        indent: this.indent > 8 ? 8 : this.indent
      })
      this.newComment = ''
      this.$emit('commentDone')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
