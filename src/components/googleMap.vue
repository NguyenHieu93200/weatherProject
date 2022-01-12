<template>
    <GmapMap
    :center="{lat:10, lng:10}"
    :zoom="7"
    map-type-id="terrain"
    style="width: 500px; height: 300px"
    >
    </GmapMap>
</template>

<script>
import { defineComponent } from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.config.productionTip = false;

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyClvH-MxHTMWVOVxND6wHPkJkWCGjYMZIA',
    libraries: 'places',
  }
});
export default defineComponent({
  name: 'GoogleMap',

})
</script>
