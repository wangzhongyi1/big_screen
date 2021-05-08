<template>
  <div class="com-container">
    <div class="com-chart" ref="chart"></div>
    <span :style="comStyle" class="iconfont arr-left" @click="handleToLeft">&#xe6ef;</span>
    <span :style="comStyle" class="iconfont arr-right" @click="handleToRight">&#xe6ed;</span>
    <span :style="comStyle" class="cat-name">{{ catName }}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      instance: null,
      allData: null,
      currIndex: 0,
      titleFontSize: 0
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    // 发送数据给服务器，告诉服务器，我现在需要数据
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  computed: {
    catName () {
      return this.allData && this.allData[this.currIndex].name
    },
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    }
  },
  methods: {
    initChart () {
      this.instance = this.$echarts.init(this.$refs.chart, 'chalk')
      const initOption = {
        title: {
          text: '▌热销商品的占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          formatter: arg => {
            // 计算出三级分类的数值总和
            let total = 0
            let str = ''
            arg.data.children.forEach(v => {
              total += v.value
            })
            arg.data.children.forEach(v => {
              str += `${v.name}: ${parseInt(v.value / total * 100)}% <br>`
            })
            return str
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: false
            },
            emphasis: { // 鼠标悬停高亮时的样式
              label: {
                show: true
              },
              labelLine: {
                show: true
              }
            }
          }
        ]
      }
      this.instance.setOption(initOption)
    },
    async getData () {
      const ret = await this.$axios.get('/hot')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      const legend = this.allData[this.currIndex].children.map(v => v.name)
      const seriesData = this.allData[this.currIndex].children.map(v => {
        return {
          name: v.name,
          value: v.value,
          children: v.children
        }
      })
      const updateOption = {
        legend: {
          data: legend
        },
        series: [
          {
            type: 'pie',
            data: seriesData
          }
        ]
      }
      this.instance.setOption(updateOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.chart.offsetWidth / 100 * 3.6
      this.titleFontSize = titleFontSize
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize,
          itemHeight: titleFontSize,
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            radius: titleFontSize * 6,
            center: ['50%', '60%']
          }
        ]
      }
      this.instance.setOption(adapterOption)
      this.instance.resize()
    },
    handleToLeft () {
      this.currIndex = this.currIndex > 0 ? --this.currIndex : 0
      this.updateChart()
    },
    handleToRight () {
      this.currIndex = this.currIndex < this.allData.length - 1 ? ++this.currIndex : this.allData.length - 1
      this.updateChart()
    }
  }
}
</script>

<style lang="scss" scoped>
.arr-left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.arr-right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #fff;
}
</style>
