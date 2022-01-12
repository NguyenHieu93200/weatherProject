import { boot } from 'quasar/wrappers'
import * as VueGoogleMaps from 'vue2-google-maps'
 
export default boot(({ app }) => {

})

app.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyClvH-MxHTMWVOVxND6wHPkJkWCGjYMZIA',
      libraries: 'places',}
  })
