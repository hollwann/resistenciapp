<template>
  <v-card flat color="#333345" outlined>
    <v-btn
      :min-width="100 / currentFooter.length + '%'"
      :to="{ name: item.route }"
      exact
      v-for="(item, index) in currentFooter"
      :key="index"
      height="100%"
      color="#333345"
      elevation="0"
      outlined
    >
      <p class="white--text">{{ item.title }}</p>
    </v-btn>
    <v-progress-linear
      value="50"
      background-color="#333345"
      color="#00aeef"
      v-if="this.$route.name == 'home'"
      style="margin-bottom:1vh"
    ></v-progress-linear>
    <v-progress-linear
      value="50"
      color="#333345"
      background-color="#00aeef"
      v-if="this.$route.name == 'activity'"
      style="margin-bottom:1vh"
    ></v-progress-linear>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      currentUser: null,
      footerVisitor: [
        { title: 'Marchas', route: 'home' },
        {
          title: 'Actividad',
          route: 'activity'
        }
      ]
    }
  },
  computed: {
    currentFooter() {
      return this.footerVisitor
    }
  }
}
</script>

<style scoped>
.navigation {
  background-color: '263238';
}
</style>
