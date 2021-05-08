<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▌' + showTitle}}</span>
      <span :style="comStyle" class="iconfont title-icon" @click="showSelect = !showSelect">&#xe6eb;</span>
      <div :style="marginStyle" class="select-con" v-show="showSelect">
        <div class="select-item" v-for="p in selectedType" :key="p.key" @click="handleChangeChoiceType(p.key)">{{p.text}}</div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      instance: null,
      allData: {},
      interval: null,
      showSelect: false,
      choiceType: 'map',
      titleFontSize: 0 // 标题文字大小
    }
  },
  created () {
    // 注册 websocket 相关的回调函数
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    // 一进来主动触发一次屏幕适配函数
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    // 注销 websocket 相关回调函数
    this.$socket.unRegisterCallBack('trendData')
  },
  computed: {
    selectedType () {
      let arr = []
      if (this.allData.type) {
        arr = this.allData.type.filter(v => v.key !== this.choiceType)
      }
      return arr
    },
    showTitle () {
      return this.allData[this.choiceType] ? this.allData[this.choiceType].title : ''
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px'
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize - 10 + 'px'
      }
    }
  },
  methods: {
    handleChangeChoiceType (type) {
      this.choiceType = type
      this.showSelect = false
      this.updateChart()
    },
    initChart () {
      this.instance = this.$echarts.init(this.$refs.trend_ref, 'chalk')
      const initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false // 紧挨 Y 轴
        },
        yAxis: {
          type: 'value'
        }
      }
      this.instance.setOption(initOption)
    },
    getData (ret) {
      console.log('组件中得到的数据', ret)
      // 从服务器获取数据，更新图表
      // const ret = await this.$axios.get('/trend')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      // 处理数据
      // 类目轴数据
      const timeArr = this.allData.common.month
      // y 轴数据 series 下的数据
      const valueArr = this.allData[this.choiceType].data
      const seriesArr = valueArr.map((v, i) => {
        return {
          name: v.name,
          type: 'line',
          data: v.data,
          stack: 'all', // 以堆叠图展示
          areaStyle: { // 颜色填充
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[i]
              },
              {
                offset: 1,
                color: colorArr2[i]
              }
            ])
          }
        }
      })
      // 图例 legend
      const legendArr = valueArr.map(v => v.name)
      const dataOption = {
        legend: {
          data: legendArr
        },
        xAxis: {
          data: timeArr
        },
        series: seriesArr
      }
      this.instance.setOption(dataOption)
    },
    // 不同分辨率适配
    screenAdapter () {
      const titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6
      this.titleFontSize = titleFontSize
      const adaptOption = {
        legend: {
          itemWidth: titleFontSize,
          itemHeight: titleFontSize,
          itemGap: titleFontSize,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.instance.setOption(adaptOption)
      this.instance.resize()
    },
    // 开始定时器
    startInterval () {
      clearInterval(this.interval)
      this.interval = setInterval(() => {}, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: #fff;
  .title-icon {
    cursor: pointer;
    margin-left: 10px;
  }
  .select-con {
    .select-item {
      padding-top: 10px;
      background-color: rgba(34, 39, 51, .2);
    }
  }
}
</style>
