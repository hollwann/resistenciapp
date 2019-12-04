<template>
  <MglMap
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="center"
    :zoom="zoom"
    :interactive="interactive"
    class="map"
  >
    <MglMarker
      v-for="marker in markers"
      :coordinates="marker.location"
      :key="marker.description"
      :color="marker.smad ? 'red ' : 'green'"
    >
    </MglMarker>
  </MglMap>
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap, MglMarker } from 'vue-mapbox'

export default {
  props: {
    markers: {
      type: Array,
      required: false
    },
    center: {
      type: Array,
      required: true
    },
    zoom: {
      type: Number,
      required: false,
      default: 9
    },
    interactive: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  components: {
    MglMap,
    MglMarker
  },
  data() {
    return {
      accessToken:
        'pk.eyJ1IjoiaG9sbHdhbm4iLCJhIjoiY2p2MXJqZnU5MXg4MjQzcGZpMDZ0OG9sMCJ9.vkMzF9wxLrcvISl-Pz8c7w', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/streets-v11', // your map style
      coordinates: [-74.079297, 4.6551322]
    }
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  }
}
</script>

<style scoped>
@import 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css';
.map {
  width: 100%;
  height: 60vh;
}
</style>
