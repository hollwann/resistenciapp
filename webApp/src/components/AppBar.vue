<template>
  <v-row cols="12" class="overflow-hidden">
    <v-app-bar dense dark>
      <v-toolbar-title>
        <v-row>
          <v-col>
            <img
              src="@/components/Icon.png"
              alt="App icon"
              width="30vw"
              height="30vh"
              style="border-radius:30px"
            />
          </v-col>
          <v-col>
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
          <v-list-item @click="showDialogTerms">
            <v-list-item-title>Información</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </v-row>
</template>

<script>
export default {
  methods: {
    showDialogTerms() {
      this.$emit('show-Dialog-Terms')
    }
  }
}
</script>

<style scoped></style>
