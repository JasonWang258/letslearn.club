<template>
  <v-bottom-sheet
    inset
    lazy
    max-width="500"
    v-model="showForm"
  >
    <v-btn
      slot="activator"
      color="red"
      dark
      fab
    >
      <v-icon>mdi-image-plus</v-icon>
    </v-btn>

    <v-card tile>
      <v-progress-linear
        :value="fileUploaded.progress"
        class="my-0"
        height="8"
      ></v-progress-linear>
      <div class="dropbox">
        <input
          type="file"
          :disabled="!isInitial"
          @change="onFileChanged"
          accept="image/*"
        >
        <p v-if="isInitial">
          Drag your image file here<br>or click to browse
        </p>
        <p v-if="isSaving">
          Uploading...
        </p>
        <!--SUCCESS-->
        <div
          v-if="isSuccess"
          class="message-box success"
        >
          <h3>Success</h3>
          <v-img
            :src="fileUploaded.downloadURL"
            contain
            class="img-responsive img-thumbnail"
            alt=""
            height="100px"
          >
            <v-layout
              slot="placeholder"
              fill-height
              align-center
              justify-center
              ma-0
            >
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-layout>
          </v-img>
          <v-btn
            color="blue-grey"
            class="white--text"
            @click="reset()"
          >Upload another</v-btn>
        </div>
        <!--FAILED-->
        <div v-if="isFailed" class="message-box warning">
          <h3>failed</h3>
          <pre>uploadError</pre>
          <v-btn
            color="blue-grey"
            class="white--text"
            @click="reset()"
          >Try again</v-btn>
        </div>
      </div>
      <v-list>
        <v-divider class="or-divider"></v-divider>
        <v-list-tile>
          <v-text-field
            label="I have image URL"
            placeholder="Paste the URL here..."
            class="ma-4"
            box
            v-model="imgUrl"
            @blur="onUrlBlur"
          ></v-text-field>
        </v-list-tile>
        <v-divider class="or-divider"></v-divider>
        <div class="ma-4">
          <v-btn
            color="blue-grey"
            class="white--text"
            block
          >
            Choose from uploaded images...
            <v-icon right dark>cloud_upload</v-icon>
          </v-btn>
        </div>
      </v-list>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ImgForm',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Boolean,
    originalImg: String
  },
  data () {
    return {
      selectedFile: null,
      uploadError: null,
      imgUrl: this.originalImg
    }
  },
  computed: {
    ...mapState({
      fileUploaded: state => state.blog.fileUploaded
    }),
    showForm: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    },
    currentStatus () {
      if (Object.keys(this.fileUploaded).length === 0 && this.fileUploaded.constructor === Object) {
        return 'initial'
      }
      if (this.fileUploaded.error) {
        return 'failed'
      }
      if (this.fileUploaded.progress < 100) {
        return 'saving'
      } else if (this.fileUploaded.progress === 100) {
        this.imgUrl = this.fileUploaded.downloadURL
        if (this.originalImg !== this.imgUrl) {
          this.$emit('newImage', this.imgUrl)
        }
        return 'success'
      }
      return 'initial'
    },
    isInitial () {
      return this.currentStatus === 'initial'
    },
    isSaving () {
      return this.currentStatus === 'saving'
    },
    isSuccess () {
      return this.currentStatus === 'success'
    },
    isFailed () {
      return this.currentStatus === 'failed'
    }
  },
  mounted () {
    this.reset()
  },
  methods: {
    reset () {
      this.$store.commit('blog/setFileUploaded', null)
      this.selectedFile = null
      this.uploadError = null
    },
    async onFileChanged (event) {
      if (!event.target.files.length) {
        return
      }
      this.selectedFile = event.target.files[0]
      if (this.selectedFile.type.split('/')[0] !== 'image') {
        this.$store.dispatch('showSnackbar', {
          message: 'Please select image file only. Thanks',
          color: 'warning'
        })
        this.reset()
        return false
      }
      await this.$store.dispatch('blog/uploadImage', this.selectedFile)
    },
    onUrlBlur () {
      if (this.originalImg !== this.imgUrl) {
        this.$emit('newImage', this.imgUrl)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.dropbox {
  display: flex;
  position: relative;
  margin: 20px 40px 0;
  height: 200px;
  text-align: center;
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightgray;
  cursor: pointer;
  &:hover {
    background: lightblue;
  }
  input {
    position: absolute;
    cursor: pointer;
    opacity: 0;
    width: 100%;
    height: 200px;
  }
  p {
    width: 100%;
    font-size: 1.2em;
    text-align: center;
    padding: 60px 10px;
  }
}
.message-box {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 20px;
  text-align: center;
}
.or-divider {
  text-align: center;
  margin: 1.5em;
  padding: 0;
  border: none;
  height: 2px;
  max-height: 2px;
  background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.25), rgba(0,0,0,0));
  &::after {
    content: "or";
    display: inline-block;
    position: relative;
    top: -0.75em;
    font-size: 1.5em;
    padding: 0 0.5em;
  }
  .theme--light &::after {
    background: white;
  }
  .theme--dark &::after {
    background: #424242;
  }
}
</style>
