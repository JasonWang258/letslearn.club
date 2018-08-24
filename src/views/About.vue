<template>
  <v-container fluid grid-list-sm>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center justify-center wrap>
        <v-flex xs12>
          <v-layout row align-center justify-center >
            <v-flex xs6 sm3>
              <v-card @click.native='gotoLink("blog")' style="cursor: pointer;">
                <v-card-media
                  :src="require('@/assets/logo.png')"
                  height="200px"
                  contain
                >
                  <v-container fill-height fluid>
                    <v-layout fill-height align-end justify-end row>
                      <v-flex class="text-xs-right" xs12 flexbox>
                        <span class="headline">Blog</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-card>
            </v-flex>
            <v-flex xs6 sm3>
              <v-card @click.native='gotoLink("blog")' style="cursor: pointer;">
                <v-card-media
                  :src="require('@/assets/logo.png')"
                  height="200px"
                  contain
                >
                  <v-container fill-height fluid>
                    <v-layout fill-height align-end justify-end row>
                      <v-flex class="text-xs-right" xs12 flexbox>
                        <span class="headline">Blog</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12>
          <v-layout row align-center justify-center>
            <v-flex xs6 sm3>
              <v-card @click.native='gotoLink("blog")' style="cursor: pointer;">
                <v-card-media
                  :src="require('@/assets/logo.png')"
                  height="200px"
                  contain
                >
                  <v-container fill-height fluid>
                    <v-layout fill-height align-end justify-end row>
                      <v-flex class="text-xs-right" xs12 flexbox>
                        <span class="headline">Blog</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-card>
            </v-flex>
            <v-flex xs6 sm3>
              <v-card @click.native='gotoLink("blog")' style="cursor: pointer;">
                <v-card-media
                  :src="require('@/assets/logo.png')"
                  height="200px"
                  contain
                >
                  <v-container fill-height fluid>
                    <v-layout fill-height align-end justify-end row>
                      <v-flex class="text-xs-right" xs12 flexbox>
                        <span class="headline">Blog</span>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-media>
              </v-card>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'about',
  data () {
    return {
      lorem: 'bo'
    }
  },
  methods: {
    gotoLink (to) {
      console.log(to)
    }
  }
}
</script>
