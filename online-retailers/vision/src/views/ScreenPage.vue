<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img alt="">
      </div>
      <span class="logo">
        <img alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img alt="切换主题" class="qiehuan">
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="fullScreenStatus.trend?'fullscreen':''">
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <div @click="handleChangeSize('trend')" class="resize">
            <span :class="['iconfont', fullScreenStatus.trend?'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="fullScreenStatus.seller?'fullscreen':''">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <div @click="handleChangeSize('seller')" class="resize">
            <span :class="['iconfont', fullScreenStatus.seller?'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="fullScreenStatus.map?'fullscreen':''">
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <div @click="handleChangeSize('map')" class="resize">
            <span :class="['iconfont', fullScreenStatus.map?'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="fullScreenStatus.rank?'fullscreen':''">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <div @click="handleChangeSize('rank')" class="resize">
            <span :class="['iconfont', fullScreenStatus.rank?'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="fullScreenStatus.hot?'fullscreen':''">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <div @click="handleChangeSize('hot')" class="resize">
            <span :class="['iconfont', fullScreenStatus.hot?'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="fullScreenStatus.stock?'fullscreen':''">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <div @click="handleChangeSize('stock')" class="resize">
            <span :class="['iconfont', fullScreenStatus.stock?'icon-compress-alt':'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'
export default {
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  data () {
    return {
      // 定义每个图表的全屏状态
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  methods: {
    handleChangeSize (type) {
      this.fullScreenStatus[type] = !this.fullScreenStatus[type]
      this.$nextTick(() => {
        this.$refs[type].screenAdapter()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed!important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
      img {
        width: 100%;
      }
    }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
