<template>
  <v-card elevation="0" dark>
    <v-row>
      <v-col
        align-self="center"
        cols="4"
        style="padding-top:0;padding-bottom:0;padding-right:0;"
      >
        <v-row justify="center">
          <v-btn
            :disabled="!canVote()"
            rounded
            color="primary"
            @click="sumVoteMessage()"
            small
          >
            <v-icon style="padding-right:1vh">mdi-thumb-up</v-icon>
          </v-btn>
        </v-row>
        <br />
        <v-row justify="center">
          {{ message.points }}
        </v-row>
        <br />
        <v-row justify="center">
          <v-btn
            :disabled="!canVote()"
            rounded
            color="red"
            @click="subVoteMessage()"
            small
          >
            <v-icon style="padding-right:1vh">mdi-thumb-down</v-icon>
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="8">
        <v-card-text>
          <p>{{ message.message }}</p>
        </v-card-text>
      </v-col>
    </v-row>
    <AlertDialog
      :message="messageAlert"
      :dialog="alert"
      @hideDialog="() => ((alert = false), (messageAlert = ''), goToHome())"
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
  methods: {
    canVote() {
      let result = true
      this.message.usersVotes.map(function(item) {
        if (auth.currentUser.uid == item) {
          result = false
        }
      })
      console.log(result)
      return result
    },
    async sumVoteMessage() {
      if (this.canVote()) {
        this.message.usersVotes.push(auth.currentUser.uid)
        await db
          .collection('messages')
          .doc(this.message.id)
          .update({
            points: this.message.points + 1,
            usersVotes: this.message.usersVotes
          })
        this.messageAlert = 'Gracias por contribuir.'
        this.alert = true
      }
    },
    async subVoteMessage() {
      if (this.canVote()) {
        this.message.usersVotes.push(auth.currentUser.uid)
        await db
          .collection('messages')
          .doc(this.message.id)
          .update({
            points: this.message.points - 1,
            usersVotes: this.message.usersVotes
          })
        this.messageAlert = 'Gracias por contribuir.'
        this.alert = true
      }
    },
    goToHome() {
      this.$router.push({
        name: 'home'
      })
    }
  }
}
</script>

<style lang="scss"></style>
