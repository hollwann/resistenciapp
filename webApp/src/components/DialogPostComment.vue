<template>
  <v-dialog persistent v-model="showDialog">
    <v-card dark style="border-radius:20px">
      <v-col cols="12">
        <p style="margin:3vh">Describe el evento:</p>
        <v-file-input
          v-model="photos"
          color="blue"
          counter
          label="Foto (opcional)"
          accept="image/*"
          placeholder="Selecciona tu imagen"
          prepend-icon="mdi-paperclip"
          outlined
          :show-size="1000"
        >
          <template v-slot:selection="{ index, text }">
            <v-chip v-if="index < 2" color="blue" dark label small>{{
              text
            }}</v-chip>

            <span
              v-else-if="index === 2"
              class="overline grey--text text--darken-3 mx-2"
              >+{{ photos.length - 2 }} File(s)</span
            >
          </template>
        </v-file-input>
        <v-textarea
          rows="1"
          outlined
          rounded
          v-model="textMessage"
        ></v-textarea>
        <v-row style="margin-top:2vh">
          <v-col cols="4" offset="1" style="margin-top:-5vh">
            <v-btn @click="hideDialog()" color="error" large>Cancelar</v-btn>
          </v-col>
          <v-col cols="5" offset="1" style="margin-top:-5vh">
            <v-btn large color="primary" @click="sendMessage()"
              >Enviar
              <v-icon style="margin-left:1vh">mdi-send-circle</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-col>
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
import imageCompression from 'browser-image-compression' //Import Image Compressor
import AlertDialog from '@/components/AlertDialog.vue'

export default {
  components: {
    AlertDialog
  },
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      textMessage: '',
      messageAlert: '',
      alert: false,
      photos: []
    }
  },
  methods: {
    hideDialog() {
      this.$emit('hide-dialog-post-comment')
    },
    async sendMessage() {
      if (this.textMessage.length < 10) {
        this.messageAlert = 'Por favor escribe un mensaje mas detallado.'
        this.alert = true
        return
      }
      let photosb64 = ''
      if (typeof this.photos.name == 'string') {
        const compressedPhoto = await this.compressImage(this.photos)
        photosb64 = await this.getBase64([compressedPhoto])
      }
      db.collection('messages').add({
        usersVotes: [auth.currentUser.uid],
        message: this.textMessage,
        points: 1,
        state: 'normal',
        date: new Date(),
        photos: photosb64
      })

      this.messageAlert = 'Mensaje enviado! Gracias.'
      this.alert = true
      this.textMessage = ''
      this.photos = []
      this.hideDialog()
    },
    async compressImage(photos) {
      var options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      try {
        const compressedFile = await imageCompression(photos, options)
        console.log(
          'compressedFile instanceof Blob',
          compressedFile instanceof Blob
        ) // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ) // smaller than maxSizeMB

        return compressedFile
      } catch (error) {
        console.log(error)
      }
    },
    async getBase64(filesx) {
      var res = await Promise.all(
        filesx.map(element => {
          return new Promise((resolve, reject) => {
            let reader = new FileReader()
            reader.readAsDataURL(element)
            reader.onload = () => {
              resolve(reader.result)
            }
            reader.onerror = reject
          })
        })
      )
      return res
    }
  }
}
</script>

<style lang="scss" scoped></style>
