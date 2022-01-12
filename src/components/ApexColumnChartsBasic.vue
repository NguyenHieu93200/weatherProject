<template>
  <apexchart
    type="line"
    height="350"
    :options="chartOptions"
    :series="series"
  ></apexchart>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";
export default {
  name: 'ApexColumnChartsBasic',
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    weatherDailys: {
      type: Object
    }
  },
  data () {
    return {
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
          id:'chart',
          type: "line",
          height: 350,
          stacked: false,
        },
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
          categories: ['1','2','3','4','5','6','7','8'],
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
    }
  },
  watch: {
    weatherDailys: function(newVal, oldVal) {
      if(newVal != oldVal){
        this.tableInfo(newVal)
      }
    }
  },
  methods: {
    async tableInfo(newVal) {
      let change = this;
      let dayOptions = [];
      let temp = [];
      let wind = [];
      let humid = [];
      await newVal.forEach(function (daily) {
        dayOptions.push(change.dayWeekName(daily.dt));
      });
      this.chartOptions = {
          ...this.chartOptions,
          xaxis: {
            categories: dayOptions,
          },
        },
      newVal.forEach(function (daily) {
        temp.push(Math.round(daily.temp.eve - 273.15));
      });
      newVal.forEach(function (daily) {
        wind.push(daily.wind_speed);
      });
      newVal.forEach(function (daily) {
        humid.push(daily.humidity);
      });
      this.series = [
        {
          name: "Temparature",
          type: "column",
          data: temp,
        },
        {
          name: "Wind",
          type: "column",
          data: wind,
        },
        {
          name: "Humidity",
          type: "line",
          data: humid,
        },
      ];
    },
    dayWeekName(date) {
      let myDate = new Date(date * 1000);
      let myDay = moment(myDate, "x").format("ddd");
      return myDay;
    },
  }
}
</script>