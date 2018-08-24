<template>
  <v-container fluid grid-list-sm fill-height>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center justify-center wrap>
        <v-flex sm12 md10 lg8 xl6>
          <ve-line
            :theme="theme"
            :data="chartData"
            :settings="chartSettings"
            :extend="extend"
            :loading="loading"
            :data-empty="dataEmpty"
            width="100">
          </ve-line>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import 'v-charts/lib/style.css'
import 'echarts/lib/component/title'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/markPoint'
// import 'echarts/lib/component/markLine'
// import 'echarts/lib/component/markArea'
import axios from 'axios'
import chalk from '@/assets/chalk.json'

// var piePatternImg = require('@/assets/logo.png')

// var itemStyle = {
//   normal: {
//     opacity: 1,
//     color: {
//       image: piePatternImg,
//       repeat: 'repeat'
//     },
//     borderWidth: 2,
//     borderColor: '#235894'
//   }
// }

export default {
  name: 'Chart',
  components: {
    VeLine
  },
  data () {
    return {
      theme: chalk,
      chartSettings: {
        metrics: ['LE', 'KM', 'HH'],
        dimension: ['year'],
        labelMap: {
          LE: 'Loodas\nEnterprises',
          KM: 'Kirk\nMarketing',
          HH: 'Hemlock\nHarling'
        },
        legendName: {
          'Hemlock\nHarling': 'Hemlock Harling'
        },
        xAxisType: 'category',
        min: [0],
        max: [2.5]
      },
      extend: {
        // backgroundColor: {
        //   image: bgPatternImg,
        //   repeat: 'repeat'
        // },
        title: {
          text: 'Experience',
          textStyle: {
            color: '#ddd'
          },
          show: true,
          left: '10px',
          top: '20px'
        },
        legend: {
          show: false,
          selectedMode: 'mulitple'
        },
        tooltip: {
          show: true,
          formatter: function (params, ticket, callback) {
            let resultText = [params[0].axisValue]
            params.forEach(element => {
              if (element.data[1] !== null) {
                resultText.push(element.seriesName)
              }
            })
            return resultText.join('<br />')
          }
        },
        yAxis: {
          show: false,
          axisLabel: {
            rotate: 45
          }
        },
        grid: {
          left: '5px',
          right: '10px',
          bottom: '65px',
          containLabel: false
        },
        dataZoom: [
          {
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            startValue: '2008',
            end: 100
          },
          {
            type: 'inside',
            xAxisIndex: [0],
            startValue: '2008',
            end: 100
          }
        ],
        series: {
          areaStyle: { normal: {} },
          stack: false,
          markPoint: {
            data: [
              {
                name: 'Company',
                type: 'max',
                symbol: 'path://M39.4,0H4.6A4.6,4.6,0,0,0,0,4.6V26.4A4.6,4.6,0,0,0,4.6,31H15v4H13.15a1,1,0,1,0,0,2L22,42l9-5a1,1,0,0,0,0-2H29V31H39.4A4.6,4.6,0,0,0,44,26.4V4.6A4.6,4.6,0,0,0,39.4,0ZM2,4.6A2.61,2.61,0,0,1,4.6,2H39.4A2.61,2.61,0,0,1,42,4.6V24l-.1,0H2Z',
                symbolSize: 125,
                symbolOffset: [0, '-50%']
              }
            ],
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'insideTop',
                  distance: 22,
                  padding: 2,
                  fontSize: 16,
                  textBorderWidth: 0,
                  formatter: (data) => {
                    let seriesName = (data.seriesName || '').toString()
                    let filterItem = this.chartData.columns[data.seriesIndex + 1]
                    let filterData = this.chartData.rows.filter((item) => {
                      return item[filterItem] === 0
                    })
                    let fromYear = filterData[0].year
                    let endYear = filterData.length === 2 ? filterData[1].year : 'now'
                    return seriesName + '\n\n' + fromYear + ' - ' + endYear
                  }
                }
              }
            }
          }
        }
      },
      chartData: {
        columns: [],
        rows: []
      },
      loading: false,
      dataEmpty: true
    }
  },
  methods: {
    getData () {
      this.loading = true
      // get data ....
      axios.get('/data/data.json').then(response => {
        this.chartData = response.data
        this.dataEmpty = false
        this.loading = false
      })
    }
  },
  created () {
    this.getData()
  }
}
</script>
