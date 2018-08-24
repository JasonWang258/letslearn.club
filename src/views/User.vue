<template>
  <v-container fluid fill-height class="bg-container">
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center justify-center>
        <v-flex xs12 sm8 lg6>
          <router-view></router-view>
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
.bg-container {
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/img/desert.jpg');
    background-size: cover;
    filter: blur(50px);
    opacity: 0.25;
  }
}
.theme--dark .v-card {
  background: rgba(22, 22, 22, 0.5)
}
</style>
