<template>
  <v-card class="elevation-6">
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">Login{{ usePhoneMethod?' via phone number':' via email' }}</h3>
        <div>{{ phoneNumber }}</div>
      </div>
    </v-card-title>
    <v-card-text>
      <v-form ref="form" @submit.prevent="formSubmit">
        <v-layout column>
          <v-flex xs12>
            <v-layout row v-if="usePhoneMethod">
              <v-flex xs5 sm4 md3>
                <v-select
                  v-model="countryCode"
                  :hint="`${countryCode.name}`"
                  :items="countryCodes"
                  persistent-hint
                  return-object
                  @change="validatePhoneNumber"
                  label="Country Code"
                  box
                >
                  <div slot="selection" slot-scope="data">
                    {{ data.item.code }}
                    <img :src="data.item.flag" width=24 class="ml-2">
                  </div>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.code"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item.name"></v-list-tile-sub-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                        <img width=24 :src="data.item.flag">
                      </v-list-tile-action>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex>
                <v-text-field
                  label="Phone Number:"
                  v-model.trim="username"
                  box
                  :mask="countryCode.code === '+1' ? 'phone' : '1##-####-####'"
                  :rules="[rules.required, rules.phone]"
                  validate-on-blur
                  clearable
                  clear-icon="cancel"
                  required
                  ref="phoneNumberRef"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-btn id="smsBtn" large dark color="blue-grey" type="submit" block @click="sendCode">
                  <v-icon left>sms</v-icon>
                  Send Code
                  <transition name="fade">
                    <v-progress-circular
                      indeterminate
                      class="ml-3"
                      :size="20"
                      v-if="performingRequestSendCode"
                    ></v-progress-circular>
                  </transition>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-text-field
              label="Email:"
              v-model.trim="username"
              box
              :rules="[rules.required, rules.email]"
              validate-on-blur
              clearable
              clear-icon="cancel"
              required
              v-else
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              :label="usePhoneMethod?'Verification Code:':'Password:'"
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
                    <router-link :to="'/user/password_reset?phone=' + usePhoneMethod">Forgot Password?</router-link>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex class="text-xs-center">
            <a href="#" @click.prevent="usePhoneMethod=!usePhoneMethod;showPassword=!showPassword" v-text="usePhoneMethod?'Or, Login via email':'Or, Login via phone number'"></a>
          </v-flex>
          <v-flex xs12 flexbox class="text-xs-center">
            <v-btn id="loginBtn" block large dark color="blue-grey" @click="login">
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
import { auth, usersCollection } from '@/firebaseConfig'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      usePhoneMethod: true,
      username: '',
      password: '',
      rememberMe: false,
      showPassword: true,
      performingRequest: false,
      performingRequestSendCode: false,
      showMessage: false,
      errorMsg: '',
      confirmationResult: null,
      countryCode: {
        name: 'Canada',
        code: '+1',
        group: 'North America',
        flag: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/ca.svg'
      },
      countryCodes: [{
        header: 'North America'
      }, {
        name: 'Canada',
        code: '+1',
        group: 'North America',
        flag: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/ca.svg'
      }, {
        name: 'United States',
        code: '+1',
        group: 'North America',
        flag: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/us.svg'
      }, {
        header: 'Asia'
      }, {
        name: 'China',
        code: '+86',
        group: 'Asia',
        flag: '//cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.3.1/flags/4x3/cn.svg'
      }],
      rules: {
        required: value => !!value || 'Required.',
        min: v => v.length >= 6 || 'Min 6 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        phone: value => {
          let pattern = /^\d{3}\d{3}\d{4}$/
          if (this.countryCode.code === '+86') {
            pattern = /^\d{3}\d{4}\d{4}$/
          }
          return pattern.test(value) || 'Invalid Phone Number.'
        }
      },
      recaptchaVerifier: null
    }
  },
  computed: {
    phoneNumber: function () {
      return this.countryCode.code + this.username
    },
    persistenceType: function () {
      return this.rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION
    },
    ...mapState([
      'isDarkTheme'
    ])
  },
  mounted () {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('smsBtn', {
      'size': 'invisible',
      'callback': (response) => {
        console.log('recaptcha:', response)
      }
    })
  },
  methods: {
    formSubmit () {
      console.log('form submit')
    },
    validatePhoneNumber () {
      if (this.username) {
        if (!this.$refs.phoneNumberRef.validate(true)) {
          this.username = ''
          this.$refs.phoneNumberRef.reset()
        }
      }
    },
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
    },
    async sendCode () {
      if (!this.$refs.phoneNumberRef.validate(true)) {
        return false
      }
      this.performingRequestSendCode = true
      try {
        let confirmationResult = await auth.signInWithPhoneNumber(this.phoneNumber, this.recaptchaVerifier)
        this.confirmationResult = confirmationResult
        this.performingRequestSendCode = false
      } catch (err) {
        this.performingRequestSendCode = false
        this.errorMsg = err.message
        this.showMessage = true
        console.log(err)
      }
    },
    async loginWithPhone () {
      if (!this.$refs.form.validate()) {
        return false
      }
      this.performingRequest = true
      try {
        await auth.setPersistence(this.persistenceType)
        let result = await this.confirmationResult.confirm(this.password)
        this.setCurrentUser(result.user)
        if (!result.user.displayName) {
          await result.user.updateProfile({
            displayName: 'guest_' + result.user.uid.slice(-5)
          })
          // create user obj
          await usersCollection.doc(result.user.uid).set({
            nickname: 'guest_' + result.user.uid.slice(-5),
            roles: { user: true }
          })
        }
        this.fetchUserProfile()
        this.$router.push('/user/setting')
        this.performingRequest = false
      } catch (err) {
        this.performingRequest = false
        this.errorMsg = err.message
        this.showMessage = true
      }
    },
    async loginWithEmail () {
      if (!this.$refs.form.validate()) {
        return false
      }
      this.performingRequest = true
      try {
        await auth.setPersistence(this.persistenceType)
        let result = await auth.signInWithEmailAndPassword(this.username, this.password)
        this.setCurrentUser(result.user)
        this.fetchUserProfile()
        this.$router.push('/user/setting')
        this.performingRequest = false
      } catch (err) {
        this.performingRequest = false
        this.errorMsg = err.message
        this.showMessage = true
      }
    },
    login () {
      if (this.usePhoneMethod) {
        this.loginWithPhone()
      } else {
        this.loginWithEmail()
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
