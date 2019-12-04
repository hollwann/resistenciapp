<template>
  <v-container fluid class="full" style="padding-top:0px">
    <br />
    <BarNavigation />
    <v-row justify="center">
      <v-col cols="7" offset="1" align-self="center">
        <p class="white--text" style="font-size:20px">
          ¿Estás marchando?
        </p>
      </v-col>
      <v-col cols="3" align-self="center">
        <v-switch v-model="marching" color="blue" inset dark></v-switch>
      </v-col>
    </v-row>
    <v-row justify="center" style="margin-top:-5vh">
      <v-col cols="7" offset="1" align-self="center">
        <p class="white--text" style="font-size:20px">
          ¿Hay ESMAD?:
        </p>
      </v-col>
      <v-col cols="3" align-self="center">
        <v-switch v-model="smad" color="red" inset dark></v-switch>
      </v-col>
    </v-row>
    <v-row justify="center" style="margin-top:-2vh">
      <v-btn color="primary" @click="showDialogSuggestion = true"
        >Sugerencia</v-btn
      >
      <v-col cols="6">
        <v-btn @click="showDialogDonations = true">Donaciones</v-btn>
      </v-col>
    </v-row>
    <br />
    <p
      class="text-center red--text"
      style="font-size:15px;margin-top:-2vh;margin-bottom:6vh"
    >
      Presiona si estas en peligro
    </p>
    <v-row
      justify="center"
      class="btnPanic"
      style="position:absolute;z-index:1;"
    >
      <v-progress-circular value="100" color="red" size="100" width="1">
        <v-progress-circular value="100" color="red" size="90" width="1">
          <v-btn
            color="red"
            x-large
            fab
            style="align:center;"
            @click="showDialogHelpFunction()"
          >
          </v-btn>
        </v-progress-circular>
      </v-progress-circular>
    </v-row>
    <v-row>
      <Map :center="[-74.079297, 4.6551322]" :markers="markers" />
    </v-row>
    <v-row style="position:absolute; bottom:17vh;left:12vw">
      <v-card color="#333345" style="padding:7px;border-radius:200px">
        <v-icon color="green">mdi-map-marker</v-icon>
        <span class="white--text">Marchantes {{ markers.length }}</span>
        <v-icon color="red">mdi-map-marker</v-icon>
        <span class="white--text">Presencia del ESMAD</span>
      </v-card>
    </v-row>
    <v-col cols="12">
      <a
        href="https://www.instagram.com/4coders.co/"
        class="white--text"
        style="text-decoration: none;"
      >
        Desarrollado por
        <img
          src="@/assets/imgs/LogoHorizontal.png"
          style="width:110px"
          href="https://4coders.co"
          align="middle"
        />

        version 0.1.5
      </a>
    </v-col>
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
import BarNavigation from '@/components/BarNavigation.vue'
import { db, auth } from '@/firebaseConfig.js'

export default {
  name: 'Home',
  components: {
    Map,
    DialogTerms,
    DialogSuggestion,
    DialogDonations,
    BarNavigation
  },
  data() {
    return {
      markers: [],
      center: [-74.079297, 4.6551322],
      allowLocation: false,
      showDialog: true,
      showDialogSuggestion: false,
      showDialogDonations: false,
      showDialogHelp: false,
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
    },
    showDialogHelpFunction() {
      this.$emit('show-dialog-help')
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
@media only screen and (max-width: 374px) {
  .btnPanic {
    top: 44vh;
    left: 40vw;
  }
}
@media only screen and (max-width: 330px) {
  .btnPanic {
    top: 51vh;
    left: 40vw;
  }
}
@media only screen and (min-width: 374px) and (max-width: 400px) {
  .btnPanic {
    top: 42vh;
    left: 40vw;
  }
}
@media only screen and (min-width: 374px) and (max-width: 400px) and (min-height: 700px) {
  .btnPanic {
    top: 33vh;
    left: 40vw;
  }
}
@media only screen and (min-width: 401px) and (max-width: 500px) {
  .btnPanic {
    top: 38vh;
    left: 40vw;
  }
}
@media only screen and (min-width: 401px) and (max-width: 500px) and (min-height: 800px) {
  .btnPanic {
    top: 33vh;
    left: 40vw;
  }
}
@media only screen and (min-width: 501px) {
  .btnPanic {
    top: 30vh;
    left: 45vw;
  }
}
@media only screen and (min-width: 800px) {
  .btnPanic {
    top: 21vh;
    left: 48vw;
  }
}
</style>
