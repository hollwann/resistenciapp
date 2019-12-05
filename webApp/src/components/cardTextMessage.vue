<template>
  <v-card elevation="0" dark color="#333345" style="width:100%; padding:2vh ">
    <v-row>
      <v-col cols="8" align-self="center">
        <p style="font-size:15px;color:gray;" class="text-left">
          {{ message.date ? dateMessage : 'Diciembre 4' }}
        </p>
        <v-card color="#333345" :style="colorMessage" outlined>
          <span :class="colorTextMessage">{{ message.message }}</span>
        </v-card>
        <p style="font-size:15px;color:#36a186;" class="text-right">
          Verificado por {{ message.points }}
        </p>
      </v-col>
      <v-col cols="2">
        <v-btn
          fab
          dark
          small
          color="#333345"
          outlined
          :disabled="!canVote"
          style="border: 2px solid #36a186;
          border-radius: 30px;"
          @click="voteMessage(1)"
        >
          <v-icon dark color="#36a186">mdi-thumb-up-outline</v-icon>
        </v-btn>
      </v-col>
      <v-col cols="2">
        <v-btn
          fab
          dark
          small
          color="#333345"
          outlined
          :disabled="!canVote"
          style="border: 2px solid red;
          border-radius: 30px;"
          @click="voteMessage(-1)"
        >
          <v-icon dark color="red">mdi-thumb-down-outline</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <AlertDialog
      :message="messageAlert"
      :dialog="alert"
      @hideDialog="() => ((alert = false), (messageAlert = ''))"
    ></AlertDialog>
  </v-card>
</template>

<script>
import { db, auth } from '@/firebaseConfig.js'
import AlertDialog from '@/components/AlertDialog.vue'
export default {
  components: {
    AlertDialog
  },
  data() {
    return {
      messageAlert: '',
      alert: false
    }
  },
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  computed: {
    canVote() {
      let result = this.message.usersVotes.filter(
        item => auth.currentUser.uid == item
      )
      if (result.length == 1) {
        result = false
      } else {
        result = true
      }
      return result
    },
    colorMessage() {
      if (this.message.state == 'help')
        return 'border: 2px solid red; border-radius: 12px; padding:10px'
      else return 'border: 2px solid white; border-radius: 12px;padding:10px'
    },
    colorTextMessage() {
      if (this.message.state == 'help') return 'red--text'
      else return 'white--text'
    },
    dateMessage() {
      var options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: 'false',
        hour: 'numeric',
        minute: 'numeric'
      }
      let dateMessage = new Date(
        this.message.date.seconds * 1000 +
          this.message.date.nanoseconds * (1 / 1000000)
      ).toLocaleString('es-ES', options)

      return dateMessage
    }
  },
  methods: {
    voteMessage(option) {
      if (this.canVote) {
        this.message.usersVotes.push(auth.currentUser.uid)
        db.collection('messages')
          .doc(this.message.id)
          .update({
            points: this.message.points + option,
            usersVotes: this.message.usersVotes
          })
        this.messageAlert = 'Gracias por contribuir.'
        this.alert = true
      }
    }
  }
}
</script>

<style lang="scss"></style>
