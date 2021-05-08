<template>
  <div class="com-container">
    <div class="com-chart" ref="map-chart"></div>
  </div>
</template>

<script>
import chinaMap from '../../public/static/map/china.json'
import { getProvinceMapInfo } from '@/utils/map_utils.js'

/**
 * 以下代码使用了 webpack 的 require.context 方法，
 * 读取 province 文件夹下面的所有 .json 文件
 */
const context = require.context('../../public/static/map/province', false, /\.json/)
context.keys().forEach(key => {
  // console.log(context(key))
})

export default {
  data () {
    return {
      instance: null,
      allData: null
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter() // 一进来就适配当前屏幕，而不用等到监听 resize 才适配
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.instance.off('click')
  },
  methods: {
    initChart () {
      this.instance = this.$echarts.init(this.$refs['map-chart'], 'chalk')
      // 注意：echarts 注册地图
      this.$echarts.registerMap('china', chinaMap)

      const option = {
        title: {
          text: '▌商家分布',
          top: 20,
          left: 20
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical' // 垂直摆放
        },
        geo: {
          type: 'map',
          map: 'china',
          itemStyle: {
            areaColor: '#2e72bf',
            borderColor: '#333' // 省份边框颜色
          }
        }
      }
      this.instance.setOption(option)
    },
    // 获取服务器散点图数据
    async getData () {
      const ret = await this.$axios.get('/map')
      this.allData = ret
      this.updateChart()
    },
    updateChart () {
      const seriesArr = this.allData.map(v => {
        // 在地图中要显示散点图，必须给图表增加一个配置，coordinateSystem: geo
        return {
          type: 'effectScatter',
          name: v.name,
          data: v.children,
          rippleEffect: {
            scale: 10, // 增大涟漪效果
            brushType: 'fill' // stroke, fill 涟漪的两种模式
          },
          coordinateSystem: 'geo' // 必填，代表散点将使用地图坐标系统
        }
      })
      const updateOption = {
        series: seriesArr
      }
      this.instance.setOption(updateOption)

      // 注册鼠标点击事件，引入相对应的地图 json 文件
      this.instance.on('click', e => {
        if (!getProvinceMapInfo(e.name).key) return
        const info = './' + getProvinceMapInfo(e.name).key + '.json'
        // 获取相对应的 json 文件
        const map = context(info)

        this.$echarts.registerMap('provinceMap', map)
        const option = {
          geo: {
            type: 'map',
            map: 'provinceMap'
          }
        }
        this.instance.setOption(option)
      })
      // 注册鼠标双击事件，回到 china 地图
      this.instance.on('dblclick', e => {
        const option = {
          geo: {
            type: 'map',
            map: 'china'
          }
        }
        this.instance.setOption(option)
      })
    },
    // 屏幕适配
    screenAdapter () {
      const titleFontSize = this.$refs['map-chart'].offsetWidth / 100 * 3.6
      const adaptOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2, // 图例间隔
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.instance.setOption(adaptOption)
      // 图表自适应
      this.instance.resize()
    }
  }
}
</script>

<style>

</style>
