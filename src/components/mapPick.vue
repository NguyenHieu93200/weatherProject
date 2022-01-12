<template>
  <GoogleMap 
  api-key="AIzaSyClvH-MxHTMWVOVxND6wHPkJkWCGjYMZIA"
  style="width: 100%; height: 500px"
  :center="center"
  :zoom="13"
  >
  </GoogleMap>
</template>

<script>
import { defineComponent } from 'vue'
import { GoogleMap } from 'vue3-google-map'
export default defineComponent({
  name: 'mapPick',
  components: { GoogleMap},
   props: {
     lat:{
       type: String,
       required: true
     },
     lng:{
       type: String,
       required: true
     },
   },
  data() {
    var lat = parseFloat(this.lat);
    var lng = parseFloat(this.lng);
    return { 
        center: { lat: lat, lng: lng }, 
    }
  },
  watch: {
      lat: function(newVal, oldVal) {
          // if(newVal != oldVal)
          //   this.$forceUpdate();
      },
      lng: function(newVal, oldVal) {
          // if(newVal != oldVal)
          //   this.$forceUpdate();
      }
  }
})
</script>
