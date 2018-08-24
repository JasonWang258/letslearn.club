<template>
  <v-card class="elevation-6">
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Login</h3>
      </div>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent>
        <v-layout column>
          <v-flex xs12>
            <v-text-field
              label="Email:"
              v-model.trim="username"
              box
              :rules="[rules.required, rules.email]"
              validate-on-blur
              clearable
              clear-icon="cancel"
              required
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Password:"
              v-model.trim="password"
              box
              :rules="[rules.required, rules.min]"
              validate-on-blur
              :type="showPassword ? 'text' : 'password'"
              :append-icon="showPassword ? 'visibility_off':'visibility'"
              @click:append="togglePasswordVisibility"
              required
            ></v-text-field>
          </v-flex>
          <v-flex>
            <v-layout row>
              <v-flex>
                <v-checkbox
                  label="Remember Me"
                  v-model="rememberMe"
                ></v-checkbox>
              </v-flex>
              <v-flex>
                <v-layout fluid fill-height align-center>
                  <v-flex class="text-xs-right">
                    <router-link to="/user/password_reset">Forgot Password?</router-link>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex xs12 flexbox class="text-xs-center">
            <v-btn block large dark color="blue-grey" @click="loginWithEmail">
              <v-icon left>lock_open</v-icon>
              Login
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
    </v-card-text>
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
    <v-divider></v-divider>
      <div class="text-xs-center pa-2 v-label">
        Not a memeber? <router-link to="/user/signup">Sign up now</router-link>
      </div>
    <v-divider></v-divider>
    <v-card-actions>
      <v-container fill-height fluid>
        <v-layout fill-height column>
          <v-flex xs12 flexbox class="text-xs-center">
            <div class="v-label mb-3">
              or, login / sign up with:
            </div>
          </v-flex>
          <v-flex xs12 flexbox class="text-xs-center">
            <v-btn flat color="blue-grey lighten-1"><v-icon left>mdi-google</v-icon>Google</v-btn>
            <v-btn flat color="orange darken-3"><v-icon left>mdi-facebook</v-icon>Facebook</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-actions>
  </v-card>
</template>

<script>
import firebase from 'firebase/app'
import { auth } from '@/firebaseConfig'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      username: 'jasonwang31258@gmail.com',
      password: '123456',
      rememberMe: false,
      showPassword: false,
      performingRequest: false,
      showMessage: false,
      errorMsg: '',
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
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
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
    },
    async loginWithEmail () {
      if (!this.$refs.form.validate()) {
        return false
      }
      // let currentUser = firebase.auth().currentUser
      this.performingRequest = true
      try {
        await auth.setPersistence(this.persistenceType)
        let user = await auth.signInWithEmailAndPassword(this.username, this.password)
        // this.$store.commit('users/setCurrentUser', user)
        this.setCurrentUser(user.user)
        // this.$sotre.dispatch('users/fetchUserProfile')
        this.fetchUserProfile()
        this.$router.push('/user/setting')
        this.performingRequest = false
      } catch (err) {
        this.performingRequest = false
        this.errorMsg = err.message
        this.showMessage = true
      }
    },
    ...mapMutations('users', [
      'setCurrentUser'
    ]),
    ...mapActions('users', [
      'fetchUserProfile'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
