<template>
  <v-container class="full">
    <v-row class="full">
      <v-alert dismissible color="blue">
        <p class="title">
          Debido a la popularidad de la app, se está trabajando en una versión
          con nuevas funcionalidades que será lanzada para el próximo
          #ParoNacional 4 de diciembre.
        </p>
      </v-alert>
      <v-col cols="6">
        <p>
          Personas marchando en este momento: <b>{{ markers.length }}</b>
        </p>
        <p>Los puntos rojos indican presencia del ESMAD.</p>
        <v-switch v-model="marching" label="¿Estás marchando?"></v-switch>
        <v-switch
          label="¿El ESMAD esta presente?"
          v-if="marching"
          v-model="smad"
        ></v-switch>
      </v-col>
      <v-col cols="6">
        <p>¿Tienes alguna sugerencia para la app? envíala aquí.</p>
        <v-btn color="primary" @click="showDialogSuggestion = true"
          >Sugerencia</v-btn
        >
        <p>Última actualización del mapa: {{ lastUpdate | parseDate }}</p>
      </v-col>
      <v-col cols="12">
        <Map :center="center" :markers="markers" />
      </v-col>
      <v-col cols="6">
        versión 0.1.8
        <a
          href="https://www.instagram.com/4coders.co/"
          class="black--text"
          style="text-decoration: none;"
          >@4coders.co</a
        ></v-col
      >
      <v-col cols="6">
        <v-btn @click="showDialogDonations = true">Donaciones</v-btn>
      </v-col>
    </v-row>
    <DialogTerms v-model="showDialog" @accept="askLocation()" />
    <DialogDonations v-model="showDialogDonations" />
    <DialogSuggestion v-model="showDialogSuggestion" />
  </v-container>
</template>

<script>
import Map from '@/components/Map.vue'
import DialogDonations from '@/components/DialogDonations.vue'
import DialogTerms from '@/components/DialogTerms.vue'
import DialogSuggestion from '@/components/DialogSuggestion.vue'
import { db, auth } from '@/firebaseConfig.js'

export default {
  name: 'Home',

  components: {
    Map,
    DialogTerms,
    DialogSuggestion,
    DialogDonations
  },
  data() {
    return {
      markers: [],
      center: [-74.079297, 4.6551322],
      allowLocation: false,
      showDialog: true,
      showDialogSuggestion: false,
      showDialogDonations: false,
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
          //Solo actualiza la posicion cada 10 minutos y si esta marchando
          console.log(this.getDiffMinutes())
          if (this.marching == false || this.getDiffMinutes() <= 5) return
          this.center = [longitude, latitude]
          this.updateLocationDB()
          console.log('Posicion actualizada')
        },
        e => console.log(e),
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000
        }
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
  },
  filters: {
    parseDate(date) {
      if (!date) {
        return ''
      }
      var options = {
        hour: 'numeric',
        minute: 'numeric',
        seconds: 'numeric'
      }

      return new Date(date).toLocaleTimeString('es-CO', options)
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
