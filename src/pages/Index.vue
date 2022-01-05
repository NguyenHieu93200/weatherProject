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
            <q-item-section class="text-grey"> No results </q-item-section>
          </q-item>
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
            </div>

            <div class="col text-center">
              <img
                :src="`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`"
              />
            </div>
            <div class="col text-center">
              <q-btn label="Detail" color="primary" @click="carousel = true" />
              <q-dialog v-model="carousel">
                <q-carousel
                  transition-prev="slide-right"
                  transition-next="slide-left"
                  swipeable
                  animated
                  v-model="slide"
                  control-color="primary"
                  navigation-icon="radio_button_unchecked"
                  navigation
                  padding
                  height="200px"
                  class="bg-white shadow-1 rounded-borders"
                >
                  <q-carousel-slide
                    :name="1"
                    class="column no-wrap flex-center"
                    style="width: 500px"
                  >
                    <q-icon
                      class="fas fa-wind"
                      color="primary"
                      size="56px"
                    ></q-icon>
                    <div class="q-mt-md text-center">
                      Wind speed: {{ weatherData.wind.speed }} m/s
                    </div>
                    <div class="q-mt-md text-center">
                      Wind gust: {{ weatherData.wind.gust }} m/s
                    </div>
                    <div class="q-mt-md text-center">
                      Wind degree: {{ weatherData.wind.deg }} degree direction
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide
                    :name="2"
                    class="column no-wrap flex-center"
                    style="width: 500px"
                  >
                    <q-icon
                      class="fas fa-tint"
                      color="primary"
                      size="56px"
                    ></q-icon>
                    <div class="q-mt-md text-center">
                      Humidity: {{ weatherData.main.humidity }} %
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide
                    :name="3"
                    class="column no-wrap flex-center"
                    style="width: 500px"
                  >
                    <q-icon
                      class="fas fa-toggle-on"
                      color="primary"
                      size="56px"
                    ></q-icon>
                    <div class="q-mt-md text-center">
                      Status: {{ weatherData.weather[0].description }}
                    </div>
                  </q-carousel-slide>
                  <q-carousel-slide
                    :name="4"
                    class="column no-wrap flex-center"
                    style="width: 500px"
                  >
                    <q-icon
                      class="fas fa-water"
                      color="primary"
                      size="56px"
                    ></q-icon>
                    <div class="q-mt-md text-center">
                      Sea level: {{ weatherData.main.sea_level }}
                    </div>
                  </q-carousel-slide>
                </q-carousel>
              </q-dialog>
            </div>
            <q-scroll-area style="height: 230px; max-width: 1100px">
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
                      :src="`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`"
                    />
                  </div>
                  <div class="col">
                    <div class="row text-h5">{{ formatHour(hour.dt) }}</div>
                    <div class="row">
                      <span>{{ Math.round(hour.temp - 273.15) }}</span>
                      <span class="text-h6 relative-position">&deg;C</span>
                    </div>
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </div>

          <div class="col-1">
            <div id="chart">
              <apexchart
                type='line'
                height="350"
                :options="chartOptions"
                :series="series"
              ></apexchart>
            </div>
          </div>
        </div>
        <div class="col-4 text-red">
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
              <div class="row text-h5">{{ dayWeekName(day.dt) }}</div>
              <div class="row">
                <span>{{ Math.round(day.temp.eve - 273.15) }}</span>
                <span class="text-h6 relative-position">&deg;C</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col"></div>
    </template>

    <template v-else>
      <div class="col column text-center text-yellow">
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
import { ref } from "vue";
import { api } from "boot/axios";
import moment from "moment";
import cities from "cities.json";
import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "PageIndex",
  components: {
    apexchart: VueApexCharts,
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
      lat: null,
      lon: null,
      apiUrl: "https://api.openweathermap.org/data/2.5/weather?",
      apiUrl2: "https://api.openweathermap.org/data/2.5/onecall?",
      apiKey: "406f101ee5301278cd0a98ef50706a37",
      errors: [],
      options: [],
      series: [
        {
          name: "Temparature",
          type: "column",
          data: [],
        },
        {
          name: "Wind",
          type: "column",
          data: [],
        },
        {
          name: "Humidity",
          type: "line",
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          type: "line",
          height: 350,
          stacked: false,
        },
        // plotOptions: {
        //   bar: {
        //     horizontal: false,
        //     columnWidth: "55%",
        //     endingShape: "rounded",
        //   },
        // },
        title: {
          text: "Graph",
          align: "left",
          offsetX: 110,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 4],
        },
        xaxis: {
          categories: [],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#008FFB",
            },
            labels: {
              style: {
                colors: "#008FFB",
              },
            },
            title: {
              text: "Temperature (°C)",
              style: {
                color: "#008FFB",
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: "Wind Speed",
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#00E396",
            },
            labels: {
              style: {
                colors: "#00E396",
              },
            },
            title: {
              text: "Wind Speed (m/s)",
              style: {
                color: "#00E396",
              },
            },
          },
          {
            seriesName: "Humidity",
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: "#FEB019",
            },
            labels: {
              style: {
                colors: "#FEB019",
              },
            },
            title: {
              text: "Humidity (%)",
              style: {
                color: "#FEB019",
              },
            },
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60,
          },
        },
        legend: {
          horizontalAlign: "left",
          offsetX: 40,
        },
      },
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
            return "bg-ligthrain1";
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
        const needle = val.toLowerCase();
        var count = 0;
        const options = cities.filter((element) =>
          element.name.toLowerCase().includes(needle)
        );
        this.options = [];
        while (count < 5) {
          this.options.push(options[count].name);
          count += 1;
        }
      });
    },
    getLocation() {
      this.$q.loading.show();
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
    },
    async getWeatherByCoords() {
      this.$q.loading.show();
      await api
        .get(
          `${this.apiUrl}lat=${this.lat}&lon=${this.lon}&appid=${this.apiKey}&units=metric`
        )
        .then((response) => {
          this.weatherData = response.data;
          this.saveFile(response.data);
        })
        .catch((e) => {
          this.$q.notify("can't find place 1");
        });

      this.getDaily(this.lat, this.lon);
      this.getHourly(this.lat, this.lon);
    },
    getDaily(lat, lon) {
      this.$q.loading.show();
      api
        .get(
          `${this.apiUrl2}lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&appid=${this.apiKey}`
        )
        .then((response) => {
          this.weatherDailys = response.data.daily;
          console.log(this.weatherDailys);
          this.tableInfo();
        })
        .catch((e) => {
          this.$q.notify("can't find place");
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
          // this.$q.loading.hide()
          latitude = response.data.coord.lat;
          longitude = response.data.coord.lon;
        })
        .catch((e) => {
          this.$q.notify("can't find place");
        });
      this.getDaily(latitude, longitude);
      this.getHourly(latitude, longitude);
    },
    tableInfo() {
      let change = this;
      let day = this.chartOptions.xaxis.categories.map(() => {});
      let temp = this.series[0].data.map(() => {});
      let wind = this.series[1].data.map(() => {});
      let humid = this.series[2].data.map(() => {});

      
      this.weatherDailys.forEach(function (daily) {
        day.push(change.dayWeekName(daily.dt));
      });
      this.updateCol(day)
      // this.chartOptions = {
      //   ...this.chartOptions,
      //   ...{
      //     xaxis: {
      //       categories: day,
      //     },
      //   },  
      // };
      console.log(day);
      this.weatherDailys.forEach(function (daily) {
        temp.push(Math.round(daily.temp.eve - 273.15));
      });
      this.weatherDailys.forEach(function (daily) {
        wind.push(daily.wind_speed);
      });
      this.weatherDailys.forEach(function (daily) {
        humid.push(daily.humidity);
      });
      // Math.round(day.temp.eve - 273.15)
      this.series = [
        {
          data: temp,
        },
        {
          data: wind,
        },
        {
          data: humid,
        },
      ];
    },
    updateCol(day){
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          xaxis: {
            categories: day
          },
        },  
      };
      console.log(this.chartOptions)
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
    saveFile: function (val) {
      const data = JSON.stringify(val);
      var fs = window.electronFs;
      try {
        fs.writeFileSync("test.json", data, "utf-8");
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
.degree
  top: -50px
.skyline
  flex: 0 0 100px
  background: url(/picture.png)
  background-size: contain
  background-position: center bottom
</style>
