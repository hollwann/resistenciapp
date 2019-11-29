<template>
  <div>
    <v-dialog :value="dialog" persistent max-width="290">
      <v-card color="primary">
        <v-card-title class="headline white--text">Notificación:</v-card-title>
        <v-card-text class="white--text">{{ message }}</v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>

          <v-btn color="white" text @click="hideDialog">Continuar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    dialog: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    hideDialog() {
      this.$emit('hideDialog')
    }
  }
}
</script>

<style scoped></style>
