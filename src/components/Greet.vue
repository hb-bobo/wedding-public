<template>
    <div class="greet">
        <!-- <image  class="head" src="../../static/images/heart-animation.gif"/> -->
        <scroll-view
            scroll-y
            class="box"
        >
            <div class="item" v-for="(item, index) in list" :key="index">
                <image :src="item.user.avatarUrl"/>
                <p>{{item.user.nickName}}</p>
            </div>
        </scroll-view>
        <p v-if="list.length" class="count">已收到{{list.length}}位好友送来的祝福</p>

    </div>
</template>

<script>
import tools from 'common/js/h_tools'
export default {
  name: 'Greet',
  props: ['list'],
  data () {
    return {
    }
  },
  computed: {
    isMock () {
      return this.$store.state.isMock
    },
    currentUserInfo () {
      return this.$store.state.currentUserInfo
    }
  },
  onShow () {
  },
  methods: {
    addUser () {
      const that = this
      const db = wx.cloud.database()
      const user = db.collection('user')
      user.add({
        data: {
          user: that.currentUserInfo
        }
      }).then(res => {
        that.getUserList()
      })
    },

    getOpenId () {
      const that = this
      wx.cloud.callFunction({
        name: 'user',
        data: {}
      }).then(res => {
        that.openId = res.result.openid
        that.getIsExist()
      })
    },

    getIsExist () {
      const that = this
      const db = wx.cloud.database()
      const user = db.collection('user')
      user.where({
        _openid: that.openId
      }).get().then(res => {
        if (res.data.length === 0) {
          that.addUser()
        } else {
          tools.showToast('您已经送过祝福了~')
        }
      })
    }

  }
}
</script>

<style lang="stylus" scoped>
.greet
    width 100%
    // height 30%
    .head
        height 150rpx
        width 200rpx
        margin 0 auto
    .box
        height 320rpx
        width 690rpx
        margin-left 30rpx
        margin-top 10rpx
        border-radius 16rpx
        box-shadow 0 0 10rpx rgba(0, 0, 0, 0.1)
        display flex
        justify-content flex-start
        align-items flex-start
        flex-wrap wrap
        .item
            width 120rpx
            display flex
            flex-direction column
            justify-content flex-start
            align-items center
            padding 10rpx 25rpx
            float left
            image
                width 100rpx
                height 100rpx
                border-radius 50rpx
            p
                height 50rpx
                line-height 50rpx
                font-size 24rpx
                color #444
                width 100rpx
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
                text-align center
    .bottom
        height 140rpx

        background rgba(255, 255, 255, 0.5)
        display flex
        justify-content center
        align-items center
        width 100%
        
    .count
        height 60rpx
        line-height 60rpx
        background rgba(255, 255, 255, 0.5)
        left 0
        font-size 28rpx
        color #444
        text-align center
        width 100%
</style>
