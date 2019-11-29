<template>
  <v-container fluid style="padding-top:0 ">
    <v-row style="max-height:100vh">
      <v-card dark>
        <v-col cols="12">
          <v-col cols="6" offset="3">
            Eventos actuales
          </v-col>

          <v-divider></v-divider>
          <v-row>
            <v-col cols="12"
              ><v-textarea
                rows="1"
                outlined
                auto-grow
                rounded
                solo
                v-model="textMessage"
              ></v-textarea
            ></v-col>
            <v-col cols="4" offset="1" style="margin-top:-5vh">
              <v-btn :to="{ name: 'home' }" color="error" large>Cancelar</v-btn>
            </v-col>
            <v-col cols="4" offset="1" style="margin-top:-5vh">
              <v-btn large color="primary" @click="sendMessage()"
                >Enviar
                <v-icon style="margin-left:1vh">mdi-send-circle</v-icon></v-btn
              >
            </v-col>
          </v-row>
          <v-col cols="12" v-for="item in allMessagesArray" :key="item.id">
            <cardTextMessage :message="item" />
            <v-divider class="divider"></v-divider>
          </v-col>
        </v-col>
      </v-card>
      <AlertDialog
        :message="messageAlert"
        :dialog="alert"
        @hideDialog="() => ((alert = false), (messageAlert = ''), goToHome())"
      ></AlertDialog>
    </v-row>
  </v-container>
</template>

<script>
import { db, auth } from '@/firebaseConfig.js'
import AlertDialog from '@/components/AlertDialog.vue'
import cardTextMessage from '@/components/cardTextMessage.vue'
const getAllMessages = (to, next) => {
  let arrayMessages = []
  db.collection('messages')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        let data = doc.data()
        data.id = doc.id
        arrayMessages.push(data)
      })
      to.params.allMessagesArray = arrayMessages
      to.params.allMessagesArray.sort(function(a, b) {
        return b.points - a.points
      })
      console.log(to.params.allMessagesArray)
      next()
    })
}
export default {
  components: {
    AlertDialog,
    cardTextMessage
  },
  beforeRouteEnter(to, from, next) {
    getAllMessages(to, next)
  },
  props: {
    allMessagesArray: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      textMessage: '',
      textComprube: '',
      messageAlert: '',
      alert: false
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
        points: 1
      })
      this.textComprube = this.textMessage
      this.messageAlert = 'Mensaje enviado! Gracias.'
      this.alert = true
      this.textMessage = ''
    },
    goToHome() {
      if (this.textComprube.length > 10) {
        this.$router.push({
          name: 'home'
        })
      }
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
