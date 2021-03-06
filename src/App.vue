<template>
  <v-app :dark="isDarkTheme">
    <v-navigation-drawer
      persistent
      :mini-variant="miniVariant"
      clipped
      v-model="drawer"
      enable-resize-watcher
      fixed
      app
    >
      <v-list>
        <v-list-tile
          value="true"
          v-for="(item, i) in items"
          :key="i"
          router
          :to="item.link"
        >
          <v-list-tile-action>
            <v-icon :dark="isDarkTheme" v-text="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title">
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      app
      clipped-left
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant" v-show="drawer">
        <v-icon v-text="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title><span @click="$router.push('/')" v-text="title" style="cursor: pointer;"></span></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="toggleLocale">
        <v-tooltip bottom>
          <v-icon
            slot="activator"
          >mdi-web</v-icon>
          <span>Toggle Laguange</span>
        </v-tooltip>
      </v-btn>
      <v-btn icon @click.stop="toggleDarkTheme">
        <v-tooltip bottom>
          <v-icon
            slot="activator"
          >mdi-invert-colors</v-icon>
          <span>Toggle Theme Color</span>
        </v-tooltip>
      </v-btn>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-menu offset-y :nudge-width="200">
          <v-btn flat slot="activator">
            <v-avatar
              size=32
            >
              <!-- <img
                v-if="currentUser"
                src="/img/icons/apple-touch-icon-180x180.png"
                alt="Avatar"
              > -->
              <v-icon v-if="currentUser">account_circle</v-icon>
              <v-icon
                v-else
              >more_vert</v-icon>
            </v-avatar>
            <span class="pl-3" v-text="userProfile.nickname"></span>
            <v-icon v-if="currentUser">arrow_drop_down</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="(item, i) in items"
              :key="i"
              @click="toggleDarkTheme"
            >
              <v-list-tile-action>
                <v-icon :dark="isDarkTheme" v-text="item.icon"></v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title v-text="item.title">
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="logout">
              <v-list-tile-action>
                <v-icon>logout</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  logout
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <transition>
        <router-view />
      </transition>
    </v-content>
    <v-snackbar
      v-model="showMessage"
      :color="messageColor"
      top
      :timeout="messageTimeout"
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
    <v-footer :fixed="fixed" app>
      <v-spacer></v-spacer>
      <span class="mr-3">&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { auth } from '@/firebaseConfig'
export default {
  name: 'App',
  data () {
    return {
      drawer: false,
      fixed: true,
      items: [{
        icon: 'bubble_chart',
        title: 'Login',
        link: '/user/login'
      }, {
        icon: 'featured_play_list',
        title: 'Profile',
        link: '/user/setting'
      }],
      miniVariant: false,
      title: ''
    }
  },
  computed: {
    ...mapState({
      isDarkTheme: state => state.isDarkTheme,
      currentUser: state => state.users.currentUser,
      userProfile: state => state.users.userProfile,
      messageColor: state => state.messageColor,
      messageTimeout: state => state.messageTimeout
    }),
    showMessage: {
      get () {
        return this.$store.state.showMessage
      },
      set (value) {
        this.$store.commit('setShowMsg', value)
      }
    },
    errorMsg: {
      get () {
        return this.$store.state.errorMsg
      },
      set (value) {
        this.$store.commit('setErrorMsg', value)
      }
    }
  },
  methods: {
    ...mapMutations([
      'toggleDarkTheme'
    ]),
    toggleLocale () {
      console.log('language')
      // this.$vuetify.lang.current = this.$vuetify.lang.current === 'en' ? 'zh-cn' : 'en'
      this.$i18n.locale = this.$i18n.locale === 'en' ? 'zh-cn' : 'en'
    },
    async logout () {
      try {
        await auth.signOut()
        this.$store.dispatch('users/clearData')
        this.$router.push('/user/login')
      } catch (error) {
        console.log('signout:', error)
      }
    }
  },
  mounted () {
  }
}
</script>

<style>
html, body, .application {
  font-family: "lucida grande", "lucida sans unicode", lucida, helvetica, "Hiragino Sans GB", "MicrosoftYaHei", "WenQuanYi Micro Hei", sans-serif;
}
@media print {
  @page {
    margin: 0;
  }
  body * {
    visibility: hidden;
  }
  .v-toolbar,
  .v-navigation-drawer,
  .v-footer {
    display: none;
  }
  .v-content {
    margin: 0;
    padding: 0!important;
  }
  #printable, #printable * {
    visibility: visible;
  }
  #printable {
    position: absolute;
    left: 0;
    top: 0;
    margin: 0;
    padding: 0;
  }
  #printable .print-only {
    visibility: visible;
    display: block;
  }
  #printable .print-exclude {
    visibility: hidden;
    display: none;
  }
}
.shadow-mask {
  padding: 0 20px 20px 20px;
  background: rgba(0, 0, 0, 0.45)
}
</style>
