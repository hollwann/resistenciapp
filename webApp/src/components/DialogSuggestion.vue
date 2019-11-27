<template>
  <v-dialog v-model="showDialog" width="300px">
    <v-card class="p-1">
      <v-card-title>Escribe tu sugerencia</v-card-title>
      <v-card-text class="black--text">
        <v-textarea outlined auto-grow v-model="suggestionText"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="sendSuggestion()" large color="primary">ENVIAR</v-btn>
        <v-btn @click="showDialog = false" color="error" large>CANCELAR</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db, auth } from '@/firebaseConfig.js'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      suggestionText: ''
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    sendSuggestion() {
      if (this.suggestionText.length < 5) {
        window.alert('Por favor escribe una sugerencia valida.')
        return
      }
      db.collection('suggestions').add({
        user: auth.currentUser.uid,
        suggestion: this.suggestionText,
        timestamp: new Date()
      })
      window.alert('Sugerencia enviada! Gracias.')
      this.showDialog = false
      this.suggestionText = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
