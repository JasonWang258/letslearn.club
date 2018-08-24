<template>
  <div>
    <v-card class="elevation-6" v-if="!accountCreateSuccess">
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Signup</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent>
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
            <v-flex xs12>
              <v-text-field
                label="Nickname: (optional)"
                v-model.trim="Nickname"
                box
                :rules="[rules.checkNickname]"
                validate-on-blur
                clearable
                clear-icon="cancel"
                required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 flexbox class="text-xs-center">
              <v-btn dark block large color="blue-grey" @click="signupWithEmail">
                <v-icon left>mdi-account-box</v-icon>
                Signup
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
      <div class="text-xs-center pa-2 v-label">
          Have an account? <router-link to="/user/login">Login now</router-link>
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
    <v-card class="elevation-6" v-else>
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">Account created</h3>
        </div>
      </v-card-title>
      <v-card-text>
        <p>Congratulations, your account has been created.
          Don't forget to check the verification email in your email inbox.
          Only verified user can leave comments.
        </p>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="text-xs-center pa-2 v-label">
            <router-link to="/user/setting" class="v-btn">Continue</router-link>
        </div>
      </v-card-actions>
    </v-card>
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
  </div>
</template>

<script>
import firebase from 'firebase/app'
import { mapState, mapMutations, mapActions } from 'vuex'
import { auth, usersCollection } from '@/firebaseConfig'
export default {
  data () {
    return {
      email: '',
      Nickname: '',
      password: '',
      showPassword: true,
      errorMsg: '',
      showMessage: false,
      performingRequest: false,
      accountCreateSuccess: true,
      rememberMe: false,
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        checkNickname: value => {
          return !value || true || 'This nickname is already taken.'
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
    async signupWithEmail () {
      if (!this.$refs.form.validate()) {
        return false
      }
      this.performingRequest = true
      try {
        await auth.setPersistence(this.persistenceType)
        let user = await auth.createUserWithEmailAndPassword(this.email, this.password)
        // this.$store.commit('users/setCurrentUser', user)
        console.log(user.user.uid)
        this.setCurrentUser(user.user)
        await user.updateProfile({
          displayName: this.Nickname || 'guest_' + user.user.uid.slice(-5)
        })
        // create user obj
        await usersCollection.doc(user.user.uid).set({
          nickname: this.Nickname || 'guest_' + user.user.uid.slice(-5),
          roles: ['guest']
        })
        this.fetchUserProfile()
        this.performingRequest = false
        this.accountCreateSuccess = true
        // this.$router.push('/user/setting')
      } catch (err) {
        this.performingRequest = false
        console.log(err)
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
