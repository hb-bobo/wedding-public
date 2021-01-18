<template>
    <div class="index">

      <Introduce v-if="isMock === true" :coverId="coverId" :setShareData="setShareData" />
      <div v-if="isMock === false" @touchstart="getUserInfo">
        <image
          class="cover"
          webp
          src="https://res1.eqh5.com/FudBqrMFzDNuDHz9Ovz5ckDvM_a4?imageMogr2/auto-orient/thumbnail/359x714%3E/format/webp"
        />
        <div :class="{bg_music: true, playing: isPlay}" @tap="audioPlay">
          <image src="../../static/images/music_icon.png" class="music_icon"/>
          <image src="../../static/images/music_play.png" class="music_play"/>
        </div>
        <div class="big-content" @touchstart="getUserInfo">
          <div class="wreath-wrap">
            <image
              class="our-photo"
              src="https://6465-dev-3gl8gydv5495d5df-1304258118.tcb.qcloud.la/Fl3WTyCnEjZpsdRdsU3WXrvm3w6C.jpg?sign=9ff5765635ffe43715872b5be2d2f20b&t=1606034453"
            />
          </div>
          <image
            class="wreath"
            webp
            src="https://res1.eqh5.com/Fh2CNzzlUAhjsdSQhCFTgi0J96qE?imageMogr2/auto-orient/thumbnail/358x352%3E/format/webp"
          />
          <div class="flex">
            <image
              class="wedding animated rotateInDownLeft"
              webp
              src="https://res1.eqh5.com/FismHXwxnvIJuYqy6Eg7sUrEc26p?imageMogr2/auto-orient/thumbnail/317x50%3E/format/webp"
            />
          </div>
          <div class="flex text-1-wrap">
            <span class="text text-1 text-center animated rotateInDownRight">一SAVE THE DATE一</span>
          </div>
          <div class="text-center bottom-box">
            <div class="our-name ">
              <span class="boy">
                &#26032;&#37070;&#65306;&#32993;&#27874;
              </span>
              <span class="symbol">&</span>
              <span class="girl">
                &#26032;&#23064;&#65306;&#26366;&#26690;&#26666;
              </span>
            </div>
            <div
              class="content text text-2 text-center animated zoomIn">
              <p>谨定于 {{date}}</p>
              <p>地址：<text @tap="copy" @touchstart="copy" user-select>吉安县</text></p>
            </div>


            <div class="flex img-line-wrap" >
              <image
                class="img-line"
                webp
                src="https://res1.eqh5.com/Fv9zfkVoh-GTIdYJZClwzfOd7Glh?imageMogr2/auto-orient/thumbnail/307x19%3E/format/webp"
              />
            </div>
            <div class="text text-3 text-center animated zoomIn">
              <p>{{tip}}</p>
              <p>We sincerely invite you to attend the wedding</p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>

import tools from 'common/js/h_tools'
import config from 'common/js/config'
import Introduce from 'components/Introduce'
export default {
  name: 'Index',
  components: {
    Introduce
  },
  data () {
    return {
      isPlay: false,
      coverId: '',
      share: {}
    }
  },
  computed: {
    tip () {
      const name = this.currentUserInfo ? `"${this.currentUserInfo.nickName}"` : '您'
      return `我们真诚地欢迎${name}参加我们的\u5a5a\u793c`
    },
    config () {
      return config[this.$store.state.configKey]
    },
    isMock () {
      return this.$store.state.isMock
    },
    currentUserInfo () {
      return this.$store.state.currentUserInfo
    },
    date () {
      return this.$store.state.date
    }
  },
  watch: {
    '$store.state.isMock' () {
      this.$forceUpdate()
    },
    config () {
      wx.setNavigationBarTitle({
        title: this.config.barTitle.index
      })
    }
  },
  onLoad () {
  },
  onShow (options) {
    if (options && options.coverId) {
      this.coverId = options.coverId
    }
    if (this.audioCtx === undefined) {
      this.audioCtx = wx.createInnerAudioContext()
      this.audioCtx.autoplay = true
      this.audioCtx.loop = true
    }
    wx.setNavigationBarTitle({
      title: this.config.barTitle.index
    })
    if (this.isMock === true || this.isMock === undefined) {
      wx.hideTabBar()
    } else {
      wx.showTabBar()

      const barTitle = this.config.barTitle
      wx.setTabBarItem({
        index: 0,
        text: barTitle.index
      })
      wx.setTabBarItem({
        index: 1,
        text: barTitle.photo
      })
      wx.setTabBarItem({
        index: 2,
        text: barTitle.map
      })
      wx.setTabBarItem({
        index: 3,
        text: barTitle.message
      })
    }
    setTimeout(() => {
      if (this.$store.state.isMock) {
        return
      }
      this.getMusicUrl()
    }, 800)
  },
  onShareAppMessage () {
    return this.share.title ? this.share : this.$store.state.share
  },
  methods: {
    getUserInfo () {
      return new Promise((resolve, reject) => {
        if (this.currentUserInfo.nickName) {
          resolve(this.currentUserInfo)
          return
        }
        wx.getUserInfo({
          success: (res) => {
            this.$store.commit('setCurrentUserInfo', res.userInfo)
            resolve(res.userInfo)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    setShareData (data) {
      this.share = data
    },
    audioPlay () {
      if (this.isPlay) {
        this.audioCtx.pause()
        this.isPlay = false
        tools.showToast('您已暂停音乐播放~')
      } else {
        this.audioCtx.play()
        this.isPlay = true
        tools.showToast('背景音乐已开启~')
      }
    },
    getMusicUrl () {
      const db = wx.cloud.database()
      const music = db.collection('music')
      music.get().then(res => {
        if (!Array.isArray(res.data) || res.data.length === 0) {
          return
        }
        this.audioUrl = res.data[0].src

        if (this.audioUrl) {
          this.audioCtx.src = this.audioUrl
          this.audioCtx.play()
          this.isPlay = true
        }
      })
    },
    getList () {
      const that = this
      const db = wx.cloud.database()
      const banner = db.collection('banner')
      banner.get().then(res => {
        if (!Array.isArray(res.data) || res.data.length === 0) {
          return
        }
        that.list = res.data[0].bannerList
        console.log(that.list)
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

<style scoped lang="stylus">
@-webkit-keyframes musicRotate
  from
    -webkit-transformb rotate(0deg)
  to
    -webkit-transform rotate(360deg)
@-webkit-keyframes musicStop
  from
    -webkit-transform rotate(20deg)
  to
    -webkit-transform rotate(0deg)
@-webkit-keyframes musicStart
  from
    -webkit-transform rotate(0deg)
  to
    -webkit-transform rotate(20deg)
@-webkit-keyframes infoAnimation
  0%
    -webkit-transform scale(1) translate(0, 0)
  50%
    -webkit-transform scale(.9) translate(5px, 5px)
  100%
    -webkit-transform scale(1) translate(0, 0)
.bg_music
  position fixed
  right 0
  top 20rpx
  width 100rpx
  z-index 99
  display flex
  justify-content flex-start
  align-items flex-start
  .music_icon
    width 60rpx
    height 60rpx
  .music_play
    width 28rpx
    height 60rpx
    margin-left -10rpx
    transform-origin top
    -webkit-transform rotate(0deg)
    animation musicStop 1s linear forwards
.bg_music.playing
  .music_play
    animation musicStart 1s linear forwards
  .music_icon
    animation musicRotate 3s linear infinite
.index
  height 100%
  position relative
  .cover
    position absolute
    top -30px
    left 0
    opacity 1
    width 100%
    height 100%
  .big-content
    position relative
    width 320px
    margin 0 auto
    padding-top 13px
  .wreath-wrap
    // position absolute
    // top 50px
    // left 50%
    margin 20px auto
    width 260px
    height 260px
    z-index 4
    // margin-left -130px
    overflow hidden
    border-radius 50%
    .our-photo
      position relative
      top: -38px
      left: -32px
      width 320px
      height 365.71px
  .wreath
    position absolute
    top 2px
    left 50%
    width 324px
    height 319.444px
    margin-left -162px
    z-index 4
    animation 20s linear 0s infinite  rotateIn

  .wedding
    margin-top 18px
    width 287px
    height 45.5241px
  .text-1-wrap
    margin-top 4px
  .text
    font-family "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif
    writing-mode horizontal-tb
    cursor default
    min-height inherit
  .text-1
    padding 5px
    width 100%
    height 100%
    font-size 12px
    letter-spacing 0.88em

  .text-2
    margin-top 10px
    font-size 13px
    letter-spacing 0em
  .text-3
    font-size 13px
    letter-spacing 0em
    color rgb(143, 143, 143)
  .bottom-box
    position fixed
    left 0
    width 100%
    bottom 8%
  .our-name
    position relative
    display flex
    width 80%
    margin 0 auto
    border-radius 30px
    overflow hidden
    color #ffffff
    .symbol
      position absolute
      left: 50%
      margin-left -8px
    .boy
      flex 1
      background-color #9ebc8e
      text-align right
      padding-right 13px
    .girl
      flex 1
      padding-left 13px
      background-color #fe84ae
      text-align left
  .img-line-wrap
    margin-top  6px

  .img-line
    width 278px
    height  17.5271px
    margin-top  -0.263573px

</style>
