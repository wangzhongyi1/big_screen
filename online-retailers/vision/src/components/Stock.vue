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
      allData: [],
      currentIndex: 0,
      timer: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // this.screenAdapter()
  },
  destroyed () {
    console.log('页面销毁')
    window.removeEventListener('resize', this.screenAdapter)
    clearInterval(this.timer)
  },
  methods: {
    initChart () {
      this.instance = this.$echarts.init(this.$refs.chart, 'chalk')
      const initOption = {
        title: {
          text: '▌库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.instance.setOption(initOption)
      this.instance.on('mouseover', e => {
        // 清除定时器
        clearInterval(this.timer)
      })
      this.instance.on('mouseout', e => {
        this.startInterval()
      })
    },
    async getData () {
      const ret = await this.$axios.get('/stock')
      this.allData = ret
      // 数据请求回来，立刻调用自适应函数
      this.screenAdapter()

      this.updateChart()
      this.startInterval()
    },
    updateChart () {
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4ff778', '#0ba82c'],
        ['#e5dd45', '#e8b11c'],
        ['#e8821c', '#e55445'],
        ['#5052ee', '#ab6ee5'],
        ['#23e5e5', '#2e72bf']
      ]
      const start = this.currentIndex * 5
      const end = start + 5
      const showData = this.allData.slice(start, end)
      const series = showData.map((v, i) => {
        return {
          type: 'pie',
          labelLine: {
            show: false
          },
          label: {
            show: true,
            position: 'center',
            textStyle: {
              color: colorArr[i][0]
            }
          },
          // 关闭动画
          hoverAnimation: false,
          // 饼图中心点坐标
          center: centerArr[i],
          name: v.name,
          data: [
            {
              name: v.name + '\n\n' + v.sales,
              value: v.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[i][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[i][1]
                  }
                ])
              }
            },
            {
              value: v.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const updateOption = {
        series: series
      }
      this.instance.setOption(updateOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6
      const series = this.allData.map(v => {
        return {
          type: 'pie',
          label: {
            textStyle: {
              fontSize: titleFontSize / 2
            }
          },
          radius: [titleFontSize * 3.25, titleFontSize * 3]
        }
      })
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: series
      }
      this.instance.setOption(adapterOption)
      this.instance.resize()
    },
    startInterval () {
      clearInterval(this.timer)
      this.timer = setInterval(_ => {
        // 切换数据
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }
        // 更新图表
        this.updateChart()
      }, 3000)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
