<template>
  <q-page class="flex column" :class="bgClass">
    <div class="col q-pt-lg q-px-md" style="max-height: 100px">
      <q-select
        v-model="search"
        @keyup.enter="getWeatherBySearch"
        label="Search"
        dark
        borderless
        use-input
        :options="options"
        @filter="filterFn"
      >
        <template v-slot:prepend>
          <q-icon @click="getLocation" name="my_location" />
        </template>
        <template v-slot:append>
          <q-btn @click="getWeatherBySearch" round dense flat icon="search" />
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <template v-if="weatherData">
      <div class="row">
        <div class="col-8 column">
          <div class="col-8">
            <div class="col text-white text-center">
              <div class="text-h4 text-weight-light">
                {{ weatherData.name }}
              </div>
              <div class="text-h6 text-weight-light">
                {{ weatherData.weather[0].main }}
              </div>
              <div class="text-h1 text-weight-thin q-my-lq relative-position">
                <span>{{ Math.round(weatherData.main.temp) }}</span>
                <span class="text-h4 relative-position degree">&deg;C</span>
              </div>
            </div>
            <div class="col text-center">
              <img
                :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
              />
            </div>
          </div>
          <q-scroll-area style="height: 230px; max-width: 560px">
            <div class="row no-wrap">
            <div style="width: 150px" class="q-pa-sm" v-for="hour in weatherHourly" :key="hour.dt">
              <div class="col-4"><img width="75" height="75" :src="`http://openweathermap.org/img/wn/${ hour.weather[0].icon }@2x.png`"></div>
              <div class="col">
                <div class="row text-h5">{{formatHour(hour.dt)}}</div>
                <div class="row">
                  <span>{{ Math.round(hour.temp - 273.15) }}</span>
                  <span class="text-h6 relative-position">&deg;C</span>
                </div>
              </div>
            </div>
            </div>
          </q-scroll-area>
        </div>
        <div class="col-4 text-white">
          <div
            class="text-h3 text-weight-thin q-my-lq relative-position row"
            v-for="day in weatherDailys"
            :key="day.dt"
          >
            <div class="col-4">
              <img
                width="75"
                height="75"
                :src="`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`"
              />
            </div>
            <div class="col">
              <div class="row text-h5">{{ dayFullName(day.dt) }}</div>
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
      <div class="col column text-center text-white">
        <div class="col text-h2 text-weight-thin">Weather<br />App</div>
      </div>
      <q-btn @click="getLocation" class="col" flat>
        <q-icon left size="3em" name="my_location" />
        <div>Find my location</div>
      </q-btn>
    </template>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import moment from "moment";
import cities from 'cities.json';

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      search: null,
      weatherData: null,
      weatherDailys: null,
      weatherHourly: null,
      lat: null,
      lon: null,
      apiUrl: "https://api.openweathermap.org/data/2.5/weather?",
      apiUrl2: "https://api.openweathermap.org/data/2.5/onecall?",
      apiKey: "406f101ee5301278cd0a98ef50706a37",
      errors: [],
      options: [],
      }
  },
  computed: {
    bgClass() {
      if (this.weatherData) {
        if (this.weatherData.weather[0].icon.endsWith("n")) {
          return "bg-night";
        } else {
          return "bg-day";
        }
      } else return "bg-day";
    },
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.options = []
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        var count = 0;
        const options = cities.filter(element => element.name.toLowerCase().includes(needle))
        this.options = []
        while(count < 5){
          this.options.push(options[count].name)
          count += 1
        }
      })
    },
    getLocation() {
      this.$q.loading.show();
      console.log(this.options)
      if (this.$q.platform.is.electron) {
        api.get("https://freegeoip.app/json/")
        .then((response) => {
          this.lat = response.data.latitude;
          this.lon = response.data.longitude;
          this.getWeatherByCoords();
        })
        .catch(e => {
          this.$q.notify("can't find place")
        });
      } else {
        navigator.geolocation.getCurrentPosition((response) => {
          this.lat = response.coords.latitude;
          this.lon = response.coords.longitude;
          this.getWeatherByCoords();
        });
      }
    },
    async getWeatherByCoords() {
      this.$q.loading.show();
      await api
        .get(
          `${this.apiUrl}lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric`
        )
        .then((response) => {
          this.weatherData = response.data;
          this.saveFile(response.data)
        })
        .catch(e => {
          this.$q.notify("can't find place 1")
        });

      this.getDaily(this.lat, this.lon);
      this.getHourly(this.lat, this.lon);
    },
    getDaily(lat, lon) {
      api
        .get(
          `${this.apiUrl2}lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${this.apiKey}`
        )
        .then((response) => {
          this.weatherDailys = response.data.daily;
        })
        .catch(e => {
           this.$q.notify("can't find place")
        });
    },
    getHourly(lat, lon) {
      api
        .get(
          `${this.apiUrl2}lat=${lat}&lon=${lon}&exclude=current,minutely,daily&appid=${this.apiKey}`
        )
        .then((response) => {
          this.weatherHourly = response.data.hourly;
          this.weatherHourly.splice(12, 36);
          this.$q.loading.hide();
        })
        .catch(e => {
          this.$q.notify("can't find place")
        });
    },
    async getWeatherBySearch() {
      let latitude = 0;
      let longitude = 0;
      this.$q.loading.show();
      await api
        .get(`${this.apiUrl}q=${this.search}&appid=${this.apiKey}&units=metric`)
        .then((response) => {
          this.weatherData = response.data;
          // this.$q.loading.hide()
          latitude = response.data.coord.lat;
          longitude = response.data.coord.lon;
        })
        .catch(e => {
          this.$q.notify("can't find place")
        });
      this.getDaily(latitude, longitude);
      this.getHourly(latitude, longitude);
    },
    weekDate(value) {
      const entireWeek =
        moment(value).format("MMMM D -") +
        moment(value).add(7, "days").format("D YYYY");
      return entireWeek; // July 6 - 13 2020
    },
    dayFullName(date) {
      let myDate = new Date(date * 1000);
      let myDay = moment(myDate, "x").format("dddd DD/MM");
      return myDay;
    },
    format_date(value) {
      if (value) {
        return moment(String(value)).format("MM/DD/YYYY hh:mm");
      }
    },
    formatHour(date) {
      let myDate = new Date(date * 1000);
      let myDay = moment(myDate, "x").format("hh:mm A DD/MM");
      return myDay;
    },
    // update file json
    saveFile: function(val) {
      const data = JSON.stringify(val)
      var fs = window.electronFs
      try { fs.writeFileSync('test.json', data, 'utf-8'); }
      catch(e) { alert('Failed to save the file !'); }
    }
  },
});
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
