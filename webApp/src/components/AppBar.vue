<template>
  <v-app-bar color="#22222e">
    <v-toolbar-title>
      <v-row>
        <v-col>
          <img
            src="@/assets/imgs/Icon.png"
            alt="App icon"
            width="30vw"
            height="30vh"
            style="border-radius:30px"
          />
        </v-col>
        <v-col class="white--text">
          ResistenciApp
        </v-col>
      </v-row>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-menu left bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item>
          <v-list-item-title>Información</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
export default {
  methods: {}
}
</script>

<style scoped></style>
