import { boot } from 'quasar/wrappers'

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // something to do
})
app.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyClvH-MxHTMWVOVxND6wHPkJkWCGjYMZIA',
    libraries: 'places',}
})