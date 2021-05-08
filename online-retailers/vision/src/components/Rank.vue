<template>
  <div class="com-container">
    <div class="com-chart" ref="chart"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      instance: null,
      allData: null,
      start: 0,
      end: 9,
      timer: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
  },
  methods: {
    initChart () {
      this.instance = this.$echarts.init(this.$refs.chart, 'chalk')
      const initOption = {
        title: {
          text: '▌地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '40%',
          left: '5%',
          right: '5%',
          bottom: '5%'
        },
        tooltip: {},
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.instance.setOption(initOption)
      // 鼠标移入清除定时器
      this.instance.on('mouseover', e => {
        clearInterval(this.timer)
      })
      // 鼠标移除启动定时器
      this.instance.on('mouseout', e => {
        this.startInterval()
      })
    },
    async getData () {
      const ret = await this.$axios.get('/rank')
      this.allData = ret
      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const colorArr = [
        ['#0ba82c', '#4ff778'],
        ['#2e72bf', '#23e5e5'],
        ['#5052ee', '#ab6ee5']
      ]
      const xAxisData = this.allData.map(v => v.name)
      const seriesData = this.allData.map(v => v.value)
      const updateOption = {
        xAxis: {
          data: xAxisData
        },
        dataZoom: {
          type: 'inside',
          show: true,
          startValue: this.start,
          endValue: this.end
        },
        series: [
          {
            data: seriesData.sort((a, b) => b - a),
            itemStyle: {
              // 不同柱子显示不同颜色
              color: e => {
                switch (true) {
                  case e.value > 300:
                    return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: colorArr[0][0]
                      },
                      {
                        offset: 1,
                        color: colorArr[0][1]
                      }
                    ])
                  case e.value > 200:
                    return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: colorArr[1][0]
                      },
                      {
                        offset: 1,
                        color: colorArr[1][1]
                      }
                    ])
                  default:
                    return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: colorArr[2][0]
                      },
                      {
                        offset: 1,
                        color: colorArr[2][1]
                      }
                    ])
                }
              }
            }
          }
        ]
      }
      this.instance.setOption(updateOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }
      this.instance.setOption(adapterOption)
      this.instance.resize()
    },
    startInterval () {
      clearInterval(this.timer)
      this.timer = setInterval(_ => {
        this.start++
        this.end++
        if (this.end > this.allData.length - 1) {
          this.start = 0
          this.end = 9
        }
        this.updateChart()
      }, 2000)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
