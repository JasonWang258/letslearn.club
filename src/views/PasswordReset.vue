<template>
  <v-card class="elevation-6">
    <v-card-title primary-title>
      <div v-if="!passwordResetSuccess">
        <h3 class="headline mb-0">Reset Password</h3>
        <div>We will send an email to you to reset your password.</div>
      </div>
      <div v-else>
        <h3 class="headline mb-0">Email Sent</h3>
        <div>Check your email for a link to reset your password.</div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent v-if="!passwordResetSuccess">
        <v-layout column>
          <v-flex xs12>
            <v-text-field
              label="Email:"
              v-model.trim="email"
              box
              :rules="[rules.required, rules.email]"
              validate-on-blur
              clearable
              clear-icon="cancel"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12 flexbox class="text-xs-center">
            <v-btn block large dark color="blue-grey" @click="resetPassword">
              <v-icon left>lock_open</v-icon>
              reset password
              <transition name="fade">
                <v-progress-circular
                  indeterminate
                  class="ml-3"
                  :size="20"
                  v-if="performingRequest"
                ></v-progress-circular>
              </transition>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-form>
      <div v-else>
        <v-btn
          @click="$router.push('/user/login')"
        >
          Back to Login
        </v-btn>
      </div>
      <v-snackbar
        v-model="showMessage"
        color="error"
        :timeout="6000"
        vertical
      >
        {{ errorMsg }}
        <v-btn
          dark
          flat
          @click="showMessage = false"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<script>
import firebase from 'firebase/app'
import { auth } from '@/firebaseConfig'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      email: '',
      performingRequest: false,
      showMessage: false,
      errorMsg: '',
      passwordResetSuccess: false,
      rules: {
        required: value => !!value || 'Required.',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        }
      }
    }
  },
  computed: {
    persistenceType: function () {
      return this.rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
    },
    ...mapState([
      'isDarkTheme'
    ])
  },
  methods: {
    async resetPassword () {
      if (!this.$refs.form.validate()) {
        return false
      }
      this.performingRequest = true
      try {
        await auth.sendPasswordResetEmail(this.email)
        this.passwordResetSuccess = true
        this.email = ''
      } catch (err) {
        console.log(err)
        this.errorMsg = err.message
        this.showMessage = true
      } finally {
        this.performingRequest = false
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
