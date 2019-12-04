<template>
  <v-dialog v-model="showDialog" width="300px">
    <v-card class="p-1">
      <v-card-title>Donaciones</v-card-title>
      <v-card-text class="black--text">
        <p>
          Debido a la popularidad de la aplicación, miles de usuarios han
          ingresado y utilizado los servidores y las base de datos en los cuales
          ResistenciApp opera, lo que genera unos cobros que los desarrolladores
          no pueden costear. Esta iniciativa es sin ánimo de lucro, por lo que
          para que la aplicación pueda seguir funcionando, te pedimos el favor
          de que realices un pequeño donativo a esta causa.
        </p>
        <p>
          Puedes enviar tu donación a este número en Nequi:
          <b>{{ donateNumber() }}</b>
        </p>
        <p>Costo de los servidores hasta hoy: ${{ cost }}</p>
        <p>Donaciones recibidas: ${{ donations }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="showDialog = false" color="error" large>CERRAR</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from '@/firebaseConfig.js'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      donations: '$2.000',
      cost: '66.800'
    }
  },
  created() {
    db.collection('donations')
      .doc('donation')
      .onSnapshot(doc => {
        this.donations = doc.data().total
        this.cost = doc.data().cost
      })
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
    donateNumber() {
      const phoneNumbers = [3124142624, 3505736093, 3118476021, 3105726365]
      return phoneNumbers[Math.floor(Math.random() * phoneNumbers.length)]
    }
  }
}
</script>

<style lang="scss" scoped></style>
