<script>
import store from './store'
export default {
  onLaunch (options) {
    if (options.query.coverId) {
      store.commit('setShareId', options.query.coverId)
    }

    //  检测小程序是否有新版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          // 小程序有新版本，会主动触发下载操作（无需开发者触发）
          wx.getUpdateManager().onUpdateFailed(function () {
            // 当新版本下载失败，会进行回调
            wx.showModal({
              title: '提示',
              content: '检查到有新版本，下载失败，请检查网络设置',
              showCancel: false
            })
          })
        }
      })
    } else { // 版本过低则无法使用该方法
      wx.showModal({
        title: '提示',
        confirmColor: '#5BB53C',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
}
</script>

<style lang="stylus">

.animated
  animation-duration 2s
  animation-fill-mode both
.animated.infinite 
  animation-iteration-count infinite

@-webkit-keyframes rotateIn
  from
    transform rotate(0deg)
  to
    transform rotate(360deg)


@-webkit-keyframes zoomIn
  0% 
    opacity 0
    -webkit-transform scale3d(.3, .3, .3)
  50% 
    opacity 1
@-webkit-keyframes rotateInUpLeft
  0%
    transform-origin: left bottom
    transform: rotate3d(0, 0, 1, 45deg)
    opacity: 0
  100%
    transform-origin: left bottom
    transform: none
    opacity: 1
@-webkit-keyframes rotateInDownLeft
  0%
    transform-origin: left bottom
    transform: rotate3d(0, 0, 1, -45deg)
    opacity: 0
  100%
    transform-origin: left bottom
    transform: none
    opacity: 1

@-webkit-keyframes rotateInDownRight
  0%
    transform-origin: right bottom
    transform: rotate3d(0, 0, 1, 45deg)
    opacity: 0
  100%
    transform-origin: right bottom
    transform: none
    opacity: 1

.rotateInDownLeft
  animation-name rotateInDownLeft
  transform-origin left bottom
.rotateInDownRight
  animation-name rotateInDownRight
  transform-origin left bottom

.rotateInUpLeft
  animation-name rotateInUpLeft
  transform-origin left bottom

.zoomIn
  -webkit-animation-name zoomIn

.flex
  display flex
  justify-content center
.text-left
  text-align left
.text-center
  text-align center
.text-right
  text-align right
.color-tip 
  color #cccccc

page
    height 100%
image
    display block


</style>
