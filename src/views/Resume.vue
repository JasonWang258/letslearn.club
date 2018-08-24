<template>
  <v-container id="printable">
    <v-layout>
      <v-flex>
        <v-card color="white" height="11in" raised>
          <v-fab-transition>
              <v-btn
                v-show="$vuetify.breakpoint.smAndUp"
                color="pink"
                :dark="isDarkTheme"
                small
                absolute
                top
                right
                fab
                @click="printResume"
                class="print-exclude">
                  <v-icon>print</v-icon>
              </v-btn>
          </v-fab-transition>
          <v-container fluid grid-list-md>
            <v-layout row wrap>
              <v-flex d-flex xs12 sm5>
                <v-layout column>
                  <v-flex d-flex>
                    <v-card color="blue-grey lighten-5" light tile flat>
                      <v-layout row wrap>
                        <v-flex d-flex>
                          <v-card-title primary-title>
                            <div class="headline">
                              <v-avatar size="48px" color="orange">
                                <v-icon>business</v-icon>
                              </v-avatar>
                              <span class="ml-4">Title</span>
                            </div>
                          </v-card-title>
                        </v-flex>
                      </v-layout>
                      <v-divider light inset></v-divider>
                      <v-card-text class="spacer">1-{{ lorem }}</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex>
                    <v-card color="brown" :dark="isDarkTheme" tile flat>
                      <v-card-text>2-{{ lorem }}</v-card-text>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs12 sm7>
                <v-layout row wrap>
                  <v-flex d-flex>
                    <v-card color="indigo lighten-2" :dark="isDarkTheme" tile flat>
                      <v-card-text>3-{{ lorem.slice(0, 70) }}</v-card-text>
                    </v-card>
                  </v-flex>
                  <v-flex d-flex>
                    <v-layout row>
                      <v-flex
                        v-for="n in 2"
                        :key="n"
                        d-flex
                      >
                        <v-card
                          color="indigo lighten-1"
                          tile
                          flat
                        >
                          <v-card-text>4-{{ lorem.slice(0, 40) }}</v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-flex>
              <v-flex d-flex xs12 sm2 child-flex>
                <v-card color="orange lighten-2" tile flat>
                  <v-card-text>5-{{ lorem.slice(0, 90) }}</v-card-text>
                </v-card>
              </v-flex>
              <v-flex d-flex xs12 sm3>
                <v-card color="red lighten-2" :dark="isDarkTheme" tile flat>
                  <v-card-text>6-{{ lorem.slice(0, 100) }}</v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Resume',
  data () {
    return {
      lorem: 'da;fsj;ghadf;lsjka; sdgha;ksduyrtqeopjfperytfhnowkhrtbo'
    }
  },
  computed: mapState([
    'isDarkTheme'
  ]),
  methods: {
    printResume () {
      window.print()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.spacer {
  margin-left: 72px;
  max-width: calc(100% - 72px);
}
</style>
