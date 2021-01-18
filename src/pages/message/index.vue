<template>
    <div class="message" v-if="isMock === false">
        <Greet :list="userList" />
        <scroll-view
            scroll-y
            @scroll="scroll"
            class="box"
        >
            <p class="place"></p>
            <div class="item" v-for="(item, index) in messageList" :key="index">
                <image class="left" :src="item.avatarUrl"/>
                <div class="right">
                    <div class="top">
                        <span class="top-l">{{item.name}}</span>
                        <span class="top-r">{{item.time}}</span>
                    </div>
                    <p v-if="item.desc !== 'heart-animation'" class="con">{{item.desc}}</p>
                    <image
                      v-if="item.desc === 'heart-animation'"
                      class="con heart-animation"
                      src="../../static/images/heart-animation.gif"
                    />
                </div>
            </div>
            <div class="text-center color-tip" v-if="loading.messageList">loading...</div>
            <p class="place-end"></p>
        </scroll-view>
        <div class="bottom">
          <button
            class="left"
            lang="zh_CN"
            open-type="getUserInfo"
            @tap="sendGreet"
            :loading="loading.greet"
            style="background:#E62C6B"
         >送上祝福</button>
          <button
            class="left"
            lang="zh_CN"
           @tap="toMessage"
           
          >说点啥吧</button>
             
          <button class="right" open-type="share" style=" background: #2CA6F9">分享喜悦</button> 
            <!-- <button class="left" lang="zh_CN" open-type="getUserInfo" @getuserinfo="toMessage">祝福一下</button>
            <button class="right" @tap="toForm">我要出席</button>  -->
            <!-- <view class="send_msg,{{showOrHidden?'show':'hide'}}">
              <form bindreset="foo">
                <input placeholder="在这里输入您要说的话" class="send_ipt" bindinput="bindKeyInput" />
                <button form-type="reset" class="send_btn">发布</button>
              </form>
            </view> -->
        </div>
        <div class="dialog" v-if="isOpen">
            <textarea focus="true" maxlength="80" class="desc" placeholder="在这里输入您想要说的话" name="textarea" placeholder-style="color:#ccc;" v-model="desc"/>
            <div class="btn">
                <button class="left" @tap="sendMessage" :loading="loading.message">发送留言</button>
               
                <button class="right" @tap="cancel">取消</button>
            </div>
        </div>
        <!-- <div class="video-dialog" @tap="toVideo">
            <image src="../../static/images/video1.png"/>
        </div> -->
        <div class="form-dialog" @tap="toForm">
            <image src="../../static/images/form.png"/>
        </div>
        <div class="video" v-show="isVideo">
            <h-video @closeVideo="closeVideo"></h-video>
        </div>
        <div class="form" v-show="isForm">
            <h-form :userInfo="currentUserInfo" @closeForm="closeForm" @getFromlist="getFromlist"></h-form>
        </div>
        <div class="form-list" v-show="isFormlist">
            <h-formlist @closeFormlist="closeFormlist" :formList="formList"></h-formlist>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import HVideo from 'components/video'
import HForm from 'components/form'
import HFormlist from 'components/formlist'
import tools from 'common/js/h_tools'
import config from 'common/js/config'
import Greet from 'components/Greet'
export default {
  name: 'Message',
  components: {
    HVideo,
    HForm,
    HFormlist,
    Greet
  },
  data () {
    return {
      isOpen: false,
      desc: '',
      messageList: [],
      userList: [],
      openId: '',
      isForm: false,
      isVideo: false,
      isFormlist: false,
      formList: [],
      loading: {
        greet: false,
        message: false,
        messageList: true
      }
    }
  },
  computed: {
    config () {
      return config[this.$store.state.configKey]
    },
    isMock () {
      return this.$store.state.isMock
    },
    currentUserInfo () {
      return this.$store.state.currentUserInfo || {}
    }
  },
  watch: {
    config () {
      wx.setNavigationBarTitle({
        title: this.config.barTitle.message
      })
    }
  },
  onReady () {
    this.isVideo = false
    this.isForm = false
    this.isFormlist = false
    this.getMessageList()
    this.getUserList()
    wx.setNavigationBarTitle({
      title: this.config.barTitle.message
    })
  },
  onShareAppMessage () {
    return this.$store.state.share
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
    getOpenId () {
      return new Promise((resolve, reject) => {
        if (this.openId) {
          resolve(this.openId)
          return
        }
        wx.cloud.callFunction({
          name: 'user',
          data: {}
        }).then(res => {
          this.openId = res.result.openid
          resolve(this.openId)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    async toMessage (e) {
      this.isOpen = true
      await this.getUserInfo()
      await this.getOpenId()
    },

    cancel () {
      const that = this
      that.isOpen = false
    },
    async sendGreet (e) {
      await this.getUserInfo()
      await this.getOpenId()
      let canGreet = true
      this.messageList.forEach(item => {
        if (item._openid === this.openId && item.desc === 'heart-animation') {
          canGreet = false
        }
      })
      if (canGreet) {
        this.getIsExist()
        this.sendMessage('heart-animation')
      } else {
        tools.showToast('您已经送过祝福了~')
      }
    },
    sendMessage (msg) {
      const that = this
      if (that.desc || (typeof msg === 'string' && msg !== '')) {
        const db = wx.cloud.database()
        const message = db.collection('message')
        this.loading.greet = true
        this.loading.message = true
        message.add({
          data: {
            desc: typeof msg === 'string' ? msg : that.desc,
            type: 'message',
            time: Date.now(),
            avatarUrl: that.currentUserInfo.avatarUrl,
            name: that.currentUserInfo.nickName
          }
        }).then(res => {
          that.getMessageList()
          that.getUserList()
          setTimeout(() => {
            that.desc = ''
            that.isOpen = false
            this.loading.greet = false
            this.loading.message = false
          }, 1000)
        })
      } else {
        tools.showToast('说点什么吧~')
      }
    },
    getMessageList () {
      const that = this
      wx.cloud.callFunction({
        name: 'messageList',
        data: {}
      }).then(({result}) => {
        this.loading.messageList = false
        if (!Array.isArray(result.data) || result.data.length === 0) {
          return
        }
        that.messageList = result.data.reverse().map(item => {
          item.time = dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
          return item
        })
        console.log(that.messageList)
      })
    },

    getUserList () {
      const that = this
      wx.cloud.callFunction({
        name: 'userList',
        data: {}
      }).then(res => {
        that.userList = res.result.data.reverse()
      })
    },
    async toForm () {
      const that = this
      that.isForm = true
      await this.getUserInfo()
      await this.getOpenId()
    },

    closeForm () {
      const that = this
      that.isForm = false
    },

    addUser () {
      const that = this
      const db = wx.cloud.database()
      const user = db.collection('user')
      user.add({
        data: {
          user: that.currentUserInfo
        }
      }).then(res => {
        console.log(res)
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
        }
      })
    },

    toVideo () {
      const that = this
      that.isVideo = true
    },

    closeVideo () {
      const that = this
      that.isVideo = false
    },

    lookList () {
      const that = this
      that.isFormlist = true
      that.getFromlist()
    },

    closeFormlist () {
      const that = this
      that.isFormlist = false
    },

    getFromlist () {
      const that = this
      wx.cloud.callFunction({
        name: 'presentList',
        data: {}
      }).then(({result}) => {
        console.log(result)
        if (!Array.isArray(result.data) || result.data.length === 0) {
          return
        }
        that.formList = result.data.reverse()
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.message
    height 100%
    width 100%
    .box
        height 60%
        // background #F9E0D9
        width 100%
        .place
            height 20rpx
        .place-end
            height 160rpx
        .item
            width 630rpx
            margin-left 30rpx
            border-radius 16rpx
            // background #fff
            display flex
            justify-content center
            align-items flex-start
            padding 30rpx
            margin-bottom 20rpx
            background-color: #ffffff;
            border-radius: 5px;
            box-shadow:  0 0 20px rgba(190,77,43,.2);
            .left
                width 100rpx
                height 100rpx
                border-radius 50rpx
            .right
                display flex
                flex-direction column
                justify-content flex-start
                min-height 100rpx
                align-items flex-start
                width 500rpx
                margin-left 20rpx
                .top
                    height 40rpx
                    width 100%
                    display flex
                    justify-content space-between
                    align-items center
                    .top-l
                        height 50rpx
                        line-height 50rpx
                        color #444
                        font-size 28rpx
                    .top-r
                        height 50rpx
                        line-height 50rpx
                        color #999
                        font-size 24rpx
                .con
                    line-height 50rpx
                    color #666
                    font-size 28rpx
                    white-space pre-wrap
                    width 100%
                .heart-animation
                  width 80px
                  height 60px
    .bottom
        position fixed
        bottom 0
        left 0
        height 140rpx
        background rgba(255, 255, 255, 0.75)
        width 100%
        display flex
        justify-content center
        align-items center
        .left, .right
            height 68rpx
            line-height 68rpx
            font-size 24rpx
            width 200rpx
            color #fff
            background #ED695D
            margin 0 20rpx 0 0
        .right
            margin 0
    .dialog
        position fixed
        bottom 0
        left 0
        z-index 99
        background #fff
        width 100%
        textarea
            height 200rpx
            line-height 42rpx
            font-size 30rpx
            color #333
            resize none
            outline none
            padding 30rpx
            width 690rpx
            background #f5f5f5
            &::-webkit-input-placeholder
                font-size 30rpx
                color #999
        .btn
            height 120rpx
            display flex
            justify-content center
            align-items center
            .left, .right
                height 80rpx
                line-height 80rpx
                font-size 28rpx
                flex 2
                color #fff
                background #ED695D
                margin 0 20rpx 0 30rpx
            .right
                flex 1
    .video-dialog
        position fixed
        right 10rpx
        top 200rpx
        width 100rpx
        height 100rpx
        box-shadow 0 0 10rpx rgba(0, 0, 0, 0.1)
        background #fff
        border-radius 16rpx
        image
            width 100%
            height 100%
    .form-dialog
        position fixed
        right 10rpx
        top 320rpx
        width 100rpx
        height 100rpx
        box-shadow 0 0 10rpx rgba(0, 0, 0, 0.1)
        background #fff
        border-radius 50rpx
        image
            width 100%
            height 100%
    .video, .form, .form-list
        position fixed
        top 0
        bottom 0
        left 0
        right 0
        background #fff
        z-index 99
    .form-list
        background rgba(0, 0, 0, 0.5)
</style>
