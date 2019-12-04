<template>
  <v-app>
    <AppBar style="max-height:50px" />
    <v-content class=" background">
      <router-view @show-dialog-help="() => (showDialogHelp = true)" />
      <FormLogin
        :dialog="showDialogHelp"
        @hide-dialog-help="() => (showDialogHelp = false)"
      />
    </v-content>
  </v-app>
</template>

<script>
import AppBar from '@/components/AppBar.vue'
import FormLogin from '@/components/FormLogin.vue'
export default {
  name: 'App',
  components: {
    AppBar,
    FormLogin
  },
  data() {
    return {
      showDialogHelp: false
    }
  }
}
</script>
<style lang="scss" scoped>
.background {
  background-color: #333345;
}
</style>
