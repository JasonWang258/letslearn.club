<template>
  <v-container fluid fill-height class="bg-container">
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center justify-center>
        <v-flex xs12 sm8 lg6>
          <h1>Ooops...</h1>
          <div>404 Page not found.</div>
          <router-link to="/">Go to Home Page</router-link>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
