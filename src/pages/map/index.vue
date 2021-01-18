<template>
    <div class="map" v-if="isMock === false">
        <image mode="aspectFit" class="head-img" src="../../static/images/t1.png"/>
        <map
          class="content"
          id="myMap"
          :longitude="longitude"
          :latitude="latitude"
          :markers="markers"
          scale="15"
          @tap="toNav"
          @markertap="toNav"
        >
        </map>
        <div class="text-right" style="padding-right: 20px">
          <text style="font-size: 10px;color:#cccccc" @tap="copy" @touchstart="copy">推荐使用高德地图导航(点我复制地址)  </text>
        </div>
        <div class="call">
          <div class="left" @tap="linkHe">
            <image src="../../static/images/he.png"/>
            <span>呼叫{{receiverNick}}</span>
          </div>
          <!-- <div class="right" @tap="linkShe">
            <image src="../../static/images/she.png"/>
            <span>呼叫对接人</span>
          </div> -->
        </div>
        <image class="footer" src="../../static/images/grren-flower-line.png"/>
    </div>
</template>

<script>
// import QQMap from 'common/js/qqmap-wx-jssdk.js'
import tools from 'common/js/h_tools'
import config from 'common/js/config'
export default {
  name: 'Map',
  data () {
    return {
      // qqSdk: '',
      latitude: 27.1448,
      longitude: 114.99457,
      markers: [{
        iconPath: '../../static/images/nav.png',
        id: 10,
        latitude: 27.1448,
        longitude: 114.99457,
        width: 28,
        height: 28,
        zIndex: 1000,
        joinCluster: false
      }],
      receiverNick: this.$store.state.receiverNick || ''
    }
  },
  computed: {
    config () {
      return config[this.$store.state.configKey]
    },
    isMock () {
      return this.$store.state.isMock
    }
  },
  watch: {
    '$store.state.receiverNick': function () {
      this.receiverNick = this.$store.state.receiverNick
    },
    config () {
      wx.setNavigationBarTitle({
        title: this.config.barTitle.map
      })
    }
  },
  onShow () {
    wx.setNavigationBarTitle({
      title: this.config.barTitle.map
    })
  },
  methods: {
    toNav () {
      wx.openLocation({
        latitude: this.latitude,
        longitude: this.longitude,
        scale: 15
      })
    },

    linkHe () {
      if (this.$store.state.receiverPhone) {
        wx.makePhoneCall({
          phoneNumber: String(this.$store.state.receiverPhone)
        })
        return
      }
      tools.showToast('号码为空，请联系新郎')
    },

    linkShe () {
      wx.makePhoneCall({
        phoneNumber: '114'
      })
    },
    copy () {
      wx.setClipboardData({
        data: '江西省吉安市',
        success: function (res) {
          wx.showToast({
            title: '复制成功'
          })
          wx.getClipboardData({
          // 这个api是把拿到的数据放到电脑系统中的
            success: function (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.map
  height 100%
  background #fff
  .head-img
    width 100%
    height 180rpx
    margin-bottom 50rpx
  .content
    width 690rpx
    margin-left 30rpx
    height 600rpx
    margin-bottom 30rpx
    border-radius 16rpx
  .call
    display flex
    justify-content space-around
    align-items center
    width 100%
    margin-bottom 20rpx
    .left, .right
      flex 1
      display flex
      flex-direction column
      justify-content center
      align-items center
      image
        height 64rpx
        width 64rpx
      span
        height 50rpx
        line-height 50rpx
        font-size 24rpx
        color #6B4F4E
  .footer
    height 80rpx
    width 716rpx
    margin-left 17rpx
</style>
