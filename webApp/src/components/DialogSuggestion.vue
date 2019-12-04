<template>
  <v-dialog v-model="showDialog" width="300px">
    <v-card class="p-1">
      <v-card-title>Escribe tu sugerencia</v-card-title>
      <v-card-text class="black--text">
        <v-textarea outlined auto-grow v-model="suggestionText"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="showDialog = false" color="error" large>CANCELAR</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="sendSuggestion()" large color="primary"
          >ENVIAR
          <v-icon style="margin-left:1vh">mdi-send-circle</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
    <AlertDialog
      :message="messageAlert"
      :dialog="alert"
      @hideDialog="() => ((alert = false), (messageAlert = ''))"
    ></AlertDialog>
  </v-dialog>
</template>

<script>
import { db, auth } from '@/firebaseConfig.js'
import AlertDialog from '@/components/AlertDialog.vue'
export default {
  components: {
    AlertDialog
  },
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      suggestionText: '',
      messageAlert: '',
      alert: false
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
        this.messageAlert = 'Por favor escribe una sugerencia valida.'
        this.alert = true
        return
      }
      db.collection('suggestions').add({
        user: auth.currentUser.uid,
        suggestion: this.suggestionText,
        timestamp: new Date()
      })
      this.messageAlert = 'Sugerencia enviada! Gracias.'
      this.alert = true
      this.showDialog = false
      this.suggestionText = ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
