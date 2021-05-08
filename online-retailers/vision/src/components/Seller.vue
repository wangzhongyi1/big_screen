<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      chartInstance: null,
      allData: [],
      pageSize: 5,
      totalPage: 0,
      currPage: 1,
      interval: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 页面加载完成时，首次进来，主动进行屏幕适配
    this.screenAdapter()
  },
  destroyed () {
    clearInterval(this.interval)
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    // 初始化 echarts 实例对象
    initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
      const initOption = {
        title: {
          text: '▌商家销售统计',
          textStyle: {
            fontSize: 66
          },
          left: 20,
          top: 20
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              width: 66,
              color: '#2d3443'
            }
          }
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '6%',
          containLabel: true // 是否包含坐标轴文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            type: 'bar',
            barWidth: 66,
            label: { // 柱子上的文字
              show: true,
              position: 'right',
              textStyle: {
                color: '#fff'
              }
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0], // 柱子四个角的圆角
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052ee'
                },
                {
                  offset: 1,
                  color: '#ab6ee5'
                }
              ]) // 柱子颜色，线性渐变 (x1,y1,x2,y2,[])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      // 对图标的鼠标移入移出事件监听，清除和重新开启定时器
      this.chartInstance.on('mouseover', e => {
        clearInterval(this.interval)
      })
      this.chartInstance.on('mouseout', e => {
        this.startInterval()
      })
    },
    // 获取服务器的数据
    async getData () {
      const ret = await this.$axios.get('/seller')
      this.totalPage = Math.ceil(ret.length / this.pageSize)
      this.allData = ret
      this.allData.sort((a, b) => a.value - b.value)
      this.updateChart()
      this.startInterval() // 启动定时器
    },
    // 更新图表
    updateChart () {
      const start = (this.currPage - 1) * this.pageSize
      const end = start + this.pageSize
      const showData = this.allData.slice(start, end)
      const yAxisData = showData.map(v => v.name)
      const seriesData = showData.map(v => v.value)
      const dataOption = {
        yAxis: {
          data: yAxisData
        },
        series: [
          {
            data: seriesData
          }
        ]
      }

      this.chartInstance.setOption(dataOption)
    },
    // 开始定时器
    startInterval () {
      // 开始定时器时先取消上一次的定时器
      clearInterval(this.interval)
      this.interval = setInterval(_ => {
        this.currPage++
        this.updateChart()
        if (this.currPage === this.totalPage) {
          this.currPage = 1
        }
      }, 3000)
    },
    // resize 窗口大小适配
    screenAdapter () {
      const titleFontSize = this.$refs.seller_ref.offsetWidth / 100 * 3.6
      // 和屏幕分辨率相关的配置项
      const adaptOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }

      this.chartInstance.setOption(adaptOption)
      this.chartInstance.resize()
    }
  }
}
</script>

<style>

</style>
