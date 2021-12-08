<template>
  <q-page class="flex column" :class='bgClass'>
    <div class="col q-pt-lg q-px-md" style="max-height:100px">
      <q-input
        v-model="search"
        @keyup.enter="getWeatherBySearch"
        label="Search"
        dark
        borderless>
        <template v-slot:prepend>
          <q-icon
            @click="getLocation"
            name="my_location" />
        </template>
        <template v-slot:append>
          <q-btn
            @click="getWeatherBySearch"
            round
            dense
            flat
            icon="search" />
        </template>
      </q-input>
    </div>

    <template v-if = "weatherData">
      <div class="row">
        <div class="col-8">
          <div class="col text-white text-center">
            <div class="text-h4 text-weight-light">
              {{weatherData.name}}
            </div>
            <div class="text-h6 text-weight-light">
              {{weatherData.weather[0].main}}
            </div>
            <div class="text-h1 text-weight-thin q-my-lq relative-position">
              <span>{{ Math.round(weatherData.main.temp) }}</span>
              <span class="text-h4 relative-position degree">&deg;C</span>
            </div>
          </div>
          <div class="col text-center">
            <img :src="`http://openweathermap.org/img/wn/${ weatherData.weather[0].icon }@2x.png`">
          </div>
        </div>
        <div class="col-4">

          <div class="text-h3 text-weight-thin q-my-lq relative-position row" v-for="day in weatherDailys.daily" :key="day.dt">
              <div class="col-4"><img width="75" height="75" :src="`http://openweathermap.org/img/wn/${ day.weather[0].icon }@2x.png`"></div>
              <div class="col">
                <div class="row text-h5">{{day.weather[0].main}}</div>
                <div class="row">
                  <span>{{ Math.round(day.temp.eve - 273.15) }}</span>
                  <span class="text-h6 relative-position">&deg;C</span>
                </div>
              </div>
            </div>
        </div>
      </div>
      <div class="col skyline"></div>
    </template>

    <template v-else>
      <div class="col column text-center">
        <div class="col text-h2 text-weight-thin">
          Weather<br>App
        </div>
      </div>
      <q-btn
        @click="getLocation"
        class="col"
        flat>
        <q-icon left size="3em" name="my_location" />
        <div>Find my location</div>
      </q-btn>
    </template>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'PageIndex',
  data() {
    return {
      search: '',
      weatherData: null,
      weatherDailys: null,
      lat: null,
      lon: null,
      apiUrl: 'https://api.openweathermap.org/data/2.5/weather?',
      apiUrl2: 'https://api.openweathermap.org/data/2.5/onecall?',
      apiKey: '406f101ee5301278cd0a98ef50706a37'
    }
  },
  computed: {
    bgClass() {
      if(this.weatherData) {
        if (this.weatherData.weather[0].icon.endsWith('n')) {
          return 'bg-night'
        }
        else { 
          return 'bg-day'
        }
      } else return 'bg-day'
    },
  },
  methods: {
    getLocation() {
      this.$q.loading.show()

      if (this.$q.platform.is.electron) {
        api.get("https://freegeoip.app/json/")
          .then(response => {
            this.lat = response.data.latitude
            this.lon = response.data.longitude
            this.getWeatherByCoords()
          })
      }

      else{
        navigator.geolocation.getCurrentPosition(response => {
          this.lat = response.coords.latitude
          this.lon = response.coords.longitude
          this.getWeatherByCoords()
        });
      }
    },
    getWeatherByCoords() {
      this.$q.loading.show()
      api.get(`${this.apiUrl}lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric`)
        .then(response => {
          this.weatherData = response.data
          console.log(this.weatherData)
        })

      api.get(`${this.apiUrl2}lat=${this.lat}&lon=${this.lon}&exclude=current,minutely,hourly&appid=${this.apiKey}`)
        .then(response => {
          this.weatherDailys = response.data
          console.log(this.weatherDailys)
          this.$q.loading.hide()
        })
    },
    getWeatherBySearch() {
      this.$q.loading.show()
      api.get(`${this.apiUrl}q=${ this.search }&appid=${this.apiKey}&units=metric`)
        .then(response => {
          this.weatherData = response.data
          this.$q.loading.hide()
        })
    },
  }
})
</script>

<style lang="sass">
  .q-page
    background: linear-gradient(to bottom,#136a8a,#267871)
    &.bg-night
      background: linear-gradient(to bottom,#232526, #414345)
    &.bg-day
      background: linear-gradient(to bottom,#00b4db, #0083b0)  
  .degree
    top: -50px
  .skyline
    flex: 0 0 100px
    background: url(/picture.png)
    background-size: contain
    background-position: center bottom
</style>