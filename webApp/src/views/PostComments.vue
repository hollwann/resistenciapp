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
      <cardTextMessage
        v-if="item.date ? checkDate(item.date) : false"
        :message="item"
      />
    </v-row>
    <DialogPostComment
      :showDialog="showDialog"
      @hide-dialog-post-comment="() => reset()"
    />
    <AlertDialog
      :message="messageAlert"
      :dialog="alert"
      @hideDialog="() => ((alert = false), (messageAlert = ''))"
    ></AlertDialog>
  </v-container>
</template>

<script>
import { db } from '@/firebaseConfig.js'
import AlertDialog from '@/components/AlertDialog.vue'
import cardTextMessage from '@/components/cardTextMessage.vue'
import BarNavigation from '@/components/BarNavigation.vue'
import DialogPostComment from '@/components/DialogPostComment.vue'

export default {
  components: {
    AlertDialog,
    cardTextMessage,
    BarNavigation,
    DialogPostComment
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
    reset() {
      this.showDialog = false
      this.abuse = false
      this.unrest = false
      this.vandalism = false
      this.tranquility = false
    },
    checkDate(date) {
      let dateMessage = new Date(
        date.seconds * 1000 + date.nanoseconds * (1 / 1000000)
      )
        .toString()
        .substring(0, 15)
      let dateNow = new Date().toString().substring(0, 15)
      if (dateMessage == dateNow) return true
      else false
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
