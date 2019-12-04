<template>
  <v-container fluid class="full" style="padding-top:0px">
    <br />
    <BarNavigation />
    <v-row>
      <v-card dark style="width:100%" color="#22222e">
        <span class="white--text" style="font-size:20px;margin:1vh">
          ¿Que estás observando?
        </span>
        <v-checkbox
          color="blue"
          label="Abuso de autoridad"
          dark
          v-model="abuse"
          style="margin-left:2vh"
          :disabled="vandalism || tranquility"
        ></v-checkbox>
        <v-checkbox
          color="blue"
          v-model="unrest"
          label="Disturbios"
          dark
          style="margin-left:2vh;margin-top:-3vh"
          :disabled="tranquility"
        ></v-checkbox>
        <v-checkbox
          color="blue"
          v-model="vandalism"
          label="Vandalismo"
          dark
          style="margin-left:2vh;margin-top:-3vh"
          :disabled="abuse || tranquility"
        ></v-checkbox>
        <v-checkbox
          color="blue"
          v-model="tranquility"
          label="Tranquilidad"
          dark
          style="margin-left:2vh;margin-top:-3vh"
          :disabled="abuse || unrest || vandalism"
        ></v-checkbox>
      </v-card>
    </v-row>

    <h2 class="white--text" style="margin-top:1vh">
      Comentarios :
    </h2>
    <v-row justify="center">
      <v-btn
        rounded
        style="font-size:15px;padding-top:1vh; "
        @click="showDialog = true"
      >
        Añade un nuevo comentario
      </v-btn>
    </v-row>
    <v-row v-for="item in allMessagesArray" :key="item.id">
      <cardTextMessage :message="item" />
    </v-row>

    <v-dialog v-model="showDialog">
      <v-card dark style="border-radius:20px">
        <p style="margin:3vh">Describe el evento:</p>
        <v-textarea
          rows="1"
          outlined
          rounded
          v-model="textMessage"
        ></v-textarea>
        <v-row style="margin-top:2vh">
          <v-col cols="4" offset="1" style="margin-top:-5vh">
            <v-btn @click="showDialog = false" color="error" large
              >Cancelar</v-btn
            >
          </v-col>
          <v-col cols="4" offset="1" style="margin-top:-5vh">
            <v-btn large color="primary" @click="sendMessage()"
              >Enviar
              <v-icon style="margin-left:1vh">mdi-send-circle</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <AlertDialog
      :message="messageAlert"
      :dialog="alert"
      @hideDialog="() => ((alert = false), (messageAlert = ''))"
    ></AlertDialog>
  </v-container>
</template>

<script>
import { db, auth } from '@/firebaseConfig.js'
import AlertDialog from '@/components/AlertDialog.vue'
import cardTextMessage from '@/components/cardTextMessage.vue'
import BarNavigation from '@/components/BarNavigation.vue'

export default {
  components: {
    AlertDialog,
    cardTextMessage,
    BarNavigation
  },
  created() {
    db.collection('messages').onSnapshot(querySnapshot => {
      let arrayMessages = []
      querySnapshot.forEach(doc => {
        let data = doc.data()
        data.id = doc.id
        arrayMessages.push(data)
      })
      arrayMessages.sort(function(a, b) {
        return b.points - a.points
      })
      this.allMessagesArray = arrayMessages
      console.log(this.allMessagesArray)
    })
  },

  data() {
    return {
      textMessage: '',
      textComprube: '',
      messageAlert: '',
      showDialog: false,
      alert: false,
      abuse: false,
      unrest: false,
      vandalism: false,
      tranquility: false,
      allMessagesArray: []
    }
  },
  methods: {
    sendMessage() {
      if (this.textMessage.length < 10) {
        this.messageAlert = 'Por favor escribe un mensaje mas detallado.'
        this.alert = true
        return
      }
      db.collection('messages').add({
        usersVotes: [auth.currentUser.uid],
        message: this.textMessage,
        points: 1,
        state: 'normal'
      })
      this.textComprube = this.textMessage
      this.messageAlert = 'Mensaje enviado! Gracias.'
      this.alert = true
      this.textMessage = ''
      this.showDialog = false
      this.abuse = false
      this.unrest = false
      this.vandalism = false
      this.tranquility = false
    }
  }
}
</script>

<style scoped>
.radius {
  border-radius: 10px;
  opacity: 0.85;
}
.divider {
  border-color: #c4d0d9;
  opacity: 0.2;
  margin-top: 1vh;
  margin-bottom: 1vh;
}
.sendMessage {
  position: -webkit-sticky;
  position: sticky;
  top: 15px;
}
</style>
