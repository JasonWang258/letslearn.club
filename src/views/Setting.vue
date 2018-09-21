<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column justify-center>
        <v-flex class="text-xs-center">
          <v-avatar
            size=96
            color="grey lighten-4"
          >
            <img src="@/assets/logo.png" alt="avatar">
          </v-avatar>
        </v-flex>
        <v-flex class="text-xs-center mt-3" xs12>
          <h3 v-text="'nick name'"></h3>
          <v-divider class="ma-3"></v-divider>
        </v-flex>
        <v-flex>
          <v-expansion-panel>
            <v-expansion-panel-content
              v-for="(item,i) in userProfile"
              :key="i"
            >
              <v-layout
              row
              align-center
              slot="header">
                <v-flex>
                  <h4 v-text="item.title"></h4>
                </v-flex>
                <v-flex class="text-xs-right pr-3">
                  <span v-text="item.value"></span>
                </v-flex>
              </v-layout>
              <v-card>
                <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
// import firebase from 'firebase/app'
// import { auth } from '@/firebaseConfig'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data () {
    return {
      showPassword: false,
      userProfile: [{
        title: 'avatar',
        value: 'abc'
      },
      {
        title: 'nick name',
        value: 'abc'
      },
      {
        title: 'email',
        value: 'abc@test.com'
      },
      {
        title: 'change password',
        value: null
      },
      {
        title: 'phone',
        value: null
      },
      {
        title: 'roles',
        value: 'user'
      }]
    }
  },
  computed: {
    ...mapState([
      'isDarkTheme'
    ])
  },
  methods: {
    togglePasswordVisibility () {
      this.showPassword = !this.showPassword
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
<style scoped>

</style>
