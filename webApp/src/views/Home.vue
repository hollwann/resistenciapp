<template>
  <v-container fluid class="full" style="padding-top:0px">
    <AppBar @show-Dialog-Terms="() => (showDialog = true)" />
    <v-row class="full">
      <v-col cols="6">
        <p>
          Personas marchando en este momento:
          <b>{{ markers.length }}</b>
        </p>
        <p>Los puntos rojos indican presencia de el ESMAD.</p>
        <v-switch v-model="marching" label="¿Estas marchando?"></v-switch>
        <v-switch
          label="¿El ESMAD esta presente?"
          v-if="marching"
          v-model="smad"
        ></v-switch>
      </v-col>
      <v-col cols="6">
        <p>¿Tienes alguna sugerencia para la app? enviala aqui.</p>
        <v-btn color="primary" @click="showDialogSuggestion = true"
          >Sugerencia</v-btn
        >
      </v-col>
      <v-col align="center" style="margin-top:-7vh">
        <v-btn color="primary" :to="{ name: 'chatEvents' }"
          >Reportar un evento</v-btn
        >
      </v-col>
      <v-col cols="12">
        <Map :center="[-74.079297, 4.6551322]" :markers="markers" />
      </v-col>
      <v-col cols="12">
        <a
          href="https://www.instagram.com/4coders.co/"
          class="black--text"
          style="text-decoration: none;"
        >
          Desarrollado por
          <img
            src="@/components/LogoHorizontal.png"
            style="width:110px"
            href="https://4coders.co"
            align="middle"
          />
        </a>
        version 0.1.5
      </v-col>
      <v-col cols="6" offset="3">POR UN MEJOR PAÍS</v-col>
    </v-row>
    <DialogTerms v-model="showDialog" @accept="askLocation()" />
    <DialogSuggestion v-model="showDialogSuggestion" />
  </v-container>
</template>

<script>
import Map from '@/components/Map.vue'
import DialogTerms from '@/components/DialogTerms.vue'
import DialogSuggestion from '@/components/DialogSuggestion.vue'
import AppBar from '@/components/AppBar.vue'
import { db, auth } from '@/firebaseConfig.js'

export default {
  name: 'Home',
  components: {
    Map,
    DialogTerms,
    DialogSuggestion,
    AppBar
  },
  data() {
    return {
      markers: [],
      center: [-74.079297, 4.6551322],
      allowLocation: false,
      showDialog: true,
      showDialogSuggestion: false,
      showDialogPostComments: false,
      marching: false,
      smad: false,
      lastUpdate: new Date()
    }
  },
  watch: {
    marching() {
      this.updateLocationDB()
    },
    smad() {
      this.updateLocationDB()
    }
  },
  methods: {
    getMarkers() {
      db.collection('users')
        .where('marching', '==', true)
        .limit(1000)
        .get()
        .then(querySnapshot => {
          let markers = []
          querySnapshot.forEach(doc => {
            let marker = doc.data()
            marker.id = doc.id
            markers.push(marker)
          })
          this.markers = markers
        })
    },
    askLocation() {
      navigator.geolocation.watchPosition(
        position => {
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          this.center = [longitude, latitude]
          //Solo actualiza la posicion cada 10 minutos y si esta marchando
          if (this.marching == false || this.getDiffMinutes() < 5) return
          this.updateLocationDB()
          console.log('Posicion actualizada')
        },
        e => console.log(e)
      )
      this.getMarkers()
      this.showDialog = false
    },
    updateLocationDB() {
      db.collection('users')
        .doc(auth.currentUser.uid)
        .set({
          timestamp: new Date(),
          marching: this.marching,
          location: this.center,
          smad: this.smad
        })
        .then(() => (this.lastUpdate = new Date()))
      this.getMarkers()
    },
    getDiffMinutes() {
      const now = new Date()
      const diffMs = now - this.lastUpdate // milliseconds between now & Christmas
      const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000) // minutes
      return diffMins
    }
  }
}
</script>

<style scoped>
.full {
  height: 100%;
  widows: 100%;
}
</style>
