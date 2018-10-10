<template>
  <v-dialog
    v-model="showDialog"
    width="300"
  >
    <v-card>
      <v-card-title
        class="headline grey lighten-2"
        primary-title
      >
        分享到微信朋友圈
      </v-card-title>
      <v-card-text v-html="qrcodeUrl">
      </v-card-text>
      <div class="px-5">打开微信，点击底部的“发现”，使用“扫一扫”即可将网页分享至朋友圈。</div>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          flat
          @click="showDialog = false"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import QRCode from 'qrcode'
export default {
  name: 'ShareDialog',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    url: String,
    value: Boolean
  },
  data () {
    return {
      qrcodeUrl: ''
    }
  },
  computed: {
    showDialog: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('change', value)
      }
    }
  },
  created () {
    this.generateQRCode(this.url)
  },
  methods: {
    async generateQRCode (text) {
      try {
        this.qrcodeUrl = await QRCode.toString(text)
      } catch (error) {
        this.$store.dispatch('showSnackbar', {
          message: error
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
