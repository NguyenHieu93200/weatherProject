<template>
  <q-page class="flex column" :class="bgClass">
    <div class="col q-pt-lg q-px-md" style="max-height: 100px">
      <!-- <q-input v-model="search" @keyup.enter="getWeatherBySearch">
        <template v-slot:append>
          <q-btn @click="getWeatherBySearch" round dense flat icon="search" />
        </template>
      </q-input> -->
      <q-select
        v-model="search"
        dark
        borderless
        use-input
        :options="options"
        @filter="filterFn"
        @keyup.enter="getWeatherBySearch"
      >
        <template v-slot:prepend>
          <q-icon @click="getLocation" name="my_location" />
        </template>
      </q-select>
    </div>

    <template v-if="weatherData">
      <div class="row">
        <div class="col-8 column">
          <div class="col-7">
            <div class="col text-red text-center">
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
              <div class="col text-center">
                <img
                  :src="`icons/${weatherData.weather[0].icon}@2x.png`"
                />
              </div>
              <div class="col text-center">
                <q-btn
                  label="More"
                  color="info"
                  @click="carousel = true"
                />
                <q-dialog v-model="carousel">
                  <q-carousel
                    transition-prev="slide-right"
                    transition-next="slide-left"
                    swipeable
                    animated
                    v-model="slide"
                    control-color="black"
                    navigation-icon="radio_button_unchecked"
                    navigation
                    padding
                    height="300px"
                    class="shadow-1 rounded-borders"
                  >
                    <q-carousel-slide
                      :name="1"
                      class="bg-wind column no-wrap flex-center"
                      style="width: 500px"
                    >
                      <q-icon
                        class="fas fa-wind"
                        color="blue"
                        size="40px"
                      ></q-icon>
                      <div class="q-mt-md text-h5 text-center text-blue text-weight-medium">
                        Wind speed: {{ weatherData.wind.speed }} m/s
                      </div>
                      <div class="q-mt-md text-h5 text-center text-blue text-weight-medium">
                        Wind gust: {{ weatherData.wind.gust }} m/s
                      </div>
                      <div class="q-mt-md text-h5 text-center text-blue text-weight-medium">
                        Wind degree: {{ weatherData.wind.deg }} degree direction
                      </div>
                    </q-carousel-slide>
                    <q-carousel-slide
                      :name="2"
                      class="bg-humidity column no-wrap flex-center"
                      style="width: 500px"
                    >
                      <q-icon
                        class="fas fa-tint"
                        color="orange"
                        size="56px"
                      ></q-icon>
                      <div class="q-mt-md text-h4 text-center text-orange text-weight-medium">
                        Humidity: {{ weatherData.main.humidity }} %
                      </div>
                    </q-carousel-slide>
                    <q-carousel-slide
                      :name="3"
                      class="bg-status column no-wrap flex-center " 
                      style="width: 500px"
                    >
                      <q-icon
                        class="fas fa-toggle-on"
                        color="yellow"
                        size="56px"
                      ></q-icon>
                      <div class="q-mt-md text-h4 text-center text-yellow text-weight-medium">
                        Status: {{ weatherData.weather[0].description }}
                      </div>
                    </q-carousel-slide>
                    <q-carousel-slide
                      :name="4"
                      class="bg-sealevel column no-wrap flex-center"
                      style="width: 500px"
                    >
                      <q-icon
                        class="fas fa-water"
                        color="cyan"
                        size="56px"
                      ></q-icon>
                      <div class="q-mt-md text-h4 text-center text-cyan text-weight-medium">
                        Sea level: {{ weatherData.main.sea_level }} m
                      </div>
                    </q-carousel-slide>
                  </q-carousel>
                </q-dialog>
              </div>
              <q-scroll-area style="height: 200px; max-width: 1100px">
                <div class="row no-wrap text-red">
                  <div
                    style="width: 128px"
                    class="q-pa-sm"
                    v-for="hour in weatherHourly"
                    :key="hour.dt"
                  >
                    <div class="col-4">
                      <img
                        width="75"
                        height="75"
                        :src="`icons/${hour.weather[0].icon}@2x.png`"
                      />
                    </div>
                    <div class="col">
                      <div class="row text-h5">{{ formatHour(hour.dt) }}</div>
                      <div class="row ">
                        <span class="text-h4 text-center">{{ Math.round(hour.temp - 273.15) }}</span>
                        <span>&deg;C</span>
                      </div>
                    </div>
                  </div>
                </div>
              </q-scroll-area>
            </div>
          </div>

          <div class="col-1">
            <div id="chart">
              <ApexColumnChartsBasic
                :weatherDailys="weatherDailys"
              ></ApexColumnChartsBasic>
            </div>
          </div>
        </div>
        <div class="col-4 text-red">
          <div
            class="text-h3 text-weight-medium q-my-lq relative-position row"
            v-for="day in weatherDailys"
            :key="day.dt"
          >
            <div class="col-4">
              <img
                width="75"
                height="75"
                :src="`icons/${day.weather[0].icon}@2x.png`"
              />
            </div>
            <div class="col">
              <div class="row text-h5">{{ dayWeekName(day.dt) }}</div>
              <div class="row">
                <span>{{ Math.round(day.temp.eve - 273.15) }}</span>
                <span class="text-h6 relative-position">&deg;C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <mapPick
      :lat = "lat"
      :lng = "lon"
      ></mapPick>
    </template>

    <template v-else>
      <div class="col column text-center text-red">
        <div class="col text-h2 text-weight-medium">Weather<br />App</div>
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
import { ref } from "vue";
import { api } from "boot/axios";
import moment from "moment";
import cities from "cities.json";
import ApexColumnChartsBasic from "../components/ApexColumnChartsBasic"
import mapPick from "../components/mapPick.vue"

export default defineComponent({
  name: "PageIndex",
  components: {
    ApexColumnChartsBasic,
    mapPick
  },
  setup() {
    return {
      carousel: ref(false),
      slide: ref(1),
    };
  },
  data() {
    return {
      search: null,
      weatherData: null,
      weatherDailys: null,
      weatherHourly: null,
      categories: [],
      lat: null,
      lon: null,
      apiUrl: "https://api.openweathermap.org/data/2.5/weather?",
      apiUrl2: "https://api.openweathermap.org/data/2.5/onecall?",
      apiKey: "406f101ee5301278cd0a98ef50706a37",
      errors: [],
      options: [],
    };
  },
  computed: {
    bgClass() {
      if (this.weatherData) {
        switch (this.weatherData.weather[0].icon) {
          case "01d":
            return "bg-day";
            break;
          case "01n":
            return "bg-night";
            break;
          case "02d":
            return "bg-cloud";
            break;
          case "02n":
            return "bg-cloud1";
            break;
          case "03d":
            return "bg-fewcloud";
            break;
          case "03n":
            return "bg-fewcloud1";
            break;
          case "04d":
            return "bg-brokencloud";
            break;
          case "04n":
            return "bg-brokencloud1";
            break;
          case "09d":
            return "bg-rain";
            break;
          case "09n":
            return "bg-rain1";
            break;
          case "10d":
            return "bg-lightrain";
            break;
          case "10n":
            return "bg-lightrain1";
            break;
          case "11d":
            return "bg-thunder";
            break;
          case "11n":
            return "bg-thunder1";
            break;
          case "13d":
            return "bg-snow";
            break;
          case "13n":
            return "bg-snow1";
            break;
          case "50d":
            return "bg-mist";
            break;
          case "50n":
            return "bg-mist1";
            break;
          default:
            return "bg-day";
            break;
        }
      } else return "bg-day";
    },
  },
  methods: {
    filterFn(val, update) {
      if (val === "") {
        update(() => {
          this.options = [];
        });
        return;
      }

      update(() => {
        const term = val.toLocaleLowerCase();
        var count = 0;
        const options = cities.filter((element) =>
          element.name.toLowerCase().includes(term)
        );
        this.options = [];
        while (count < 5) {
          this.options.push(options[count].name);
          count += 1;
        }
      });
    },
    getLocation() {
      if (window.navigator.onLine) {
        if (this.$q.platform.is.electron) {
          api
            .get("https://freegeoip.app/json/")
            .then((response) => {
              this.lat = response.data.latitude;
              this.lon = response.data.longitude;
              this.getWeatherByCoords();
            })
            .catch((e) => {
              this.$q.notify("can't find place");
            });
        } else {
          navigator.geolocation.getCurrentPosition((response) => {
            this.lat = response.coords.latitude;
            this.lon = response.coords.longitude;
            this.getWeatherByCoords();
          });
        }
      } else {
        var fs = window.electronFs;
        try {
          let weatherDailys
          let weatherHourly
          alert("No internet connection");
          this.weatherData = JSON.parse(
            fs.readFileSync("current.json", { encoding: "utf8", flag: "r" })
          );
          weatherDailys = JSON.parse(
            fs.readFileSync("daily.json", { encoding: "utf8", flag: "r" })
          );
          this.weatherDailys = weatherDailys.daily
          weatherHourly = JSON.parse(
            fs.readFileSync("hourly.json", { encoding: "utf8", flag: "r" })
          );
          this.weatherHourly = weatherHourly.hourly
        } catch (e) {
          alert("Failed to read the file !");
        }
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
          // console.log(response.data);
          this.saveFile(response.data, 1);
        })
        .catch((e) => {
        });

      this.getDaily(this.lat, this.lon, true);
      this.getHourly(this.lat, this.lon, true);
    },
    async getDaily(lat, lon, checkCurrent) {
      await api
        .get(
          `${this.apiUrl2}lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${this.apiKey}`
        )
        .then((response) => {
          this.weatherDailys = response.data.daily;
          if (checkCurrent) {
            this.saveFile(response.data, 2);
          }
        })
        .catch((e) => {
        });
    },
    async getHourly(lat, lon, checkCurrent) {
      await api
        .get(
          `${this.apiUrl2}lat=${lat}&lon=${lon}&exclude=current,minutely,daily&appid=${this.apiKey}`
        )
        .then((response) => {
          this.weatherHourly = response.data.hourly;
          this.weatherHourly.splice(12, 36);
          this.$q.loading.hide();
          if (checkCurrent) {
            this.saveFile(response.data, 3);
          }
        })
        .catch((e) => {
          this.$q.notify("can't find place");
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
          console.log(response.data);
          latitude = response.data.coord.lat;
          longitude = response.data.coord.lon;
          this.lat = response.data.coord.lat;
          this.lon = response.data.coord.lon;
        })
        .catch((e) => {
          this.$q.notify("can't find place");
        });
      this.getDaily(latitude, longitude, false);
      this.getHourly(latitude, longitude, false);
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
    dayWeekName(date) {
      let myDate = new Date(date * 1000);
      let myDay = moment(myDate, "x").format("ddd");
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
    saveFile: function (val, file) {
      const data = JSON.stringify(val);
      var fs = window.electronFs;
      try {
        switch (file) {
          case 1:
            fs.writeFileSync("current.json", data, "utf-8");
            break;
          case 2:
            fs.writeFileSync("daily.json", data, "utf-8");
            break;
          case 3:
            fs.writeFileSync("hourly.json", data, "utf-8");
            break;
        }
      } catch (e) {
        alert("Failed to save the file !");
      }
    },
  },
});
</script>

<style lang="sass">
.q-page
  background: linear-gradient(to bottom,#136a8a,#267871)
  &.bg-night
    background: url(/Clear1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-day
    background: url(/Clear.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-cloud
    background: url(/Cloud.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-cloud1
    background: url(/Cloud1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-fewcloud
    background: url(/FewCloud.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-fewcloud1
    background: url(/FewCloud1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-brokencloud
    background: url(/Brokencloud.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-brokencloud1
    background: url(/Brokencloud1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-rain
    background: url(/Rain.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-rain1
    background: url(/Rain1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-lightrain
    background: url(/Lightrain.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-lightrain1
    background: url(/Lightrain1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-thunder
    background: url(/Thunder.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-thunder1
    background: url(/Thunder1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-snow
    background: url(/Snow.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-snow1
    background: url(/Snow1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-mist
    background: url(/Mist.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
  &.bg-mist1
    background: url(/Mist1.jpg)
    height: 100%
    background-position: center
    background-repeat: no-repeat
    background-size: cover
.bg-wind
  background: url(/wind.jpg)
  height: 100%
  background-position: center
  background-repeat: no-repeat
  background-size: cover
.bg-status
  background: url(/Clear.jpg)
  height: 100%
  background-position: center
  background-repeat: no-repeat
  background-size: cover
.bg-humidity
  background: url(/humidity.jpg)
  height: 100%
  background-position: center
  background-repeat: no-repeat
  background-size: cover
.bg-sealevel
  background: url(/sealevel.jpg)
  height: 100%
  background-position: center
  background-repeat: no-repeat
  background-size: cover
.degree
  top: -50px
.skyline
  flex: 0 0 100px
  background: url(/picture.png)
  background-size: contain
  background-position: center bottom
</style>
