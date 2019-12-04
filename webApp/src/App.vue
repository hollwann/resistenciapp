<template>
  <v-app>
    <AppBar style="max-height:50px" />
    <v-content class=" background">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar.vue'

export default {
  name: 'App',
  components: {
    AppBar
  }
}
</script>
<style lang="scss" scoped>
.background {
  background-color: #333345;
}
</style>
