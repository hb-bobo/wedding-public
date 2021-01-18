<template>
  <div class="index">
    <div class="cover-wrap" :class="{creating: creating}" >
      <image
        class="cover"
        webp
        src="https://res1.eqh5.com/FudBqrMFzDNuDHz9Ovz5ckDvM_a4?imageMogr2/auto-orient/thumbnail/359x714%3E/format/webp"
      />
      
      <div :class="{bg_music: true, playing: isPlay}" @tap="audioPlay">
        <image src="../../static/images/music_icon.png" class="music_icon"/>
        <image src="../../static/images/music_play.png" class="music_play"/>
      </div>
      <div class="big-content">
        <div class="wreath-wrap">
          <image
            class="our-photo"
            :src="myConfig.photo"
            mode="aspectFill"
            :style="{left: myConfig.photoStyle.left + 'px', top: myConfig.photoStyle.top + 'px'}"
          />
        </div>
        <button
        class="cover-upload"
         v-if="creating" 
         @tap="chooseImageTap"
         >点击上传/更新合照</button>
        <button
          class="cover-eidtor-button left"
          v-if="creating && photoEditting" 
          @tap="transPhoto('left')"
        >left</button>
        <button
          class="cover-eidtor-button top"
          v-if="creating && photoEditting" 
          @tap="transPhoto('top')"
        >top</button>
        <button
          class="cover-eidtor-button right"
          v-if="creating && photoEditting" 
          @tap="transPhoto('right')"
        >right</button>
        <button
          class="cover-eidtor-button bottom"
          v-if="creating && photoEditting" 
          @tap="transPhoto('bottom')"
        >bottom</button>
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
            <span  v-if="!creating" class="boy">
              {{myConfig.boy}}
            </span>
            <div class="boy" v-if="creating"><input class="form-input" type="text" placeholder="请输入新郎姓名" v-model="myConfig.boy"></div>
            <span class="symbol">&</span>
            <span v-if="!creating" class="girl">
              {{myConfig.girl}}
            </span>
            <div class="girl" v-if="creating"><input class="form-input" type="text" placeholder="请输入新娘姓名" v-model="myConfig.girl"></div>
          </div>
          <div
            class="content text text-2 text-center animated zoomIn">
            <p v-if="!creating">谨定于 {{myConfig.date}}</p>
            <div v-if="creating">日期<input class="form-input" type="text" placeholder="请输入婚期" v-model="myConfig.date"></div>
            <p v-if="!creating">地址：<text @tap="copy" @touchstart="copy" user-select>{{myConfig.address}}</text></p>
            <div v-if="creating">地址：<input class="form-input" type="text" placeholder="请输入婚礼举办地址" v-model="myConfig.address"></div>
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

    <div v-if="creating" class="buttons">
      <button @tap="transPhoto" :loading="loading" v-if="myConfig.photo">{{buttonText}}</button>
      <button @tap="createCover" :loading="loading">制作</button>
      <button @tap="share"  open-type="share"  :loading="loading">分享</button>
    </div>
  </div>
</template>

<script>

import tools from 'common/js/h_tools'
import config from 'common/js/config'

export default {
  name: 'Index',
  components: {

  },
  props: ['coverId', 'setShareData'],
  data () {
    return {
      isPlay: false,
      creating: true,
      loading: false,
      photoEditting: false,
      myConfig: {
        photo: '',
        music: 'https://qnm.hunliji.com/n-LvZJP0teoKD9I40PDyXmbhuJQ=/FqLM-1Nc9l-ppz-vZ8IehL3R_D40.mp3',
        boy: '',
        girl: '',
        date: '',
        address: '',
        photoStyle: {
          left: 0,
          top: 0
        }
      }
    }
  },
  computed: {
    buttonText () {
      return this.photoEditting ? '调整完毕' : '调整图片位置'
    },
    tip () {
      const name = this.currentUserInfo ? `"${this.currentUserInfo.nickName}"` : '您'
      return `我们真诚地欢迎${name}参加我们的\u5a5a\u793c`
    },
    config () {
      return config[this.$store.state.configKey]
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
    '$store' () {
      if (this.$store.state.shareId && this.creating === true) {
        this.creating = false
      }
    }
  },
  onLoad (options) {
    if (this.audioCtx === undefined) {
      this.audioCtx = wx.createInnerAudioContext()
      this.audioCtx.autoplay = true
      this.audioCtx.loop = true
    }
    wx.setNavigationBarTitle({
      title: '邀请函 '
    })

    if (this.coverId || this.$store.state.shareId) {
      this.creating = false
      this.getCoverData(this.coverId || this.$store.state.shareId)
    } else {
      this.getCoverData()
    }
  },
  onShow (options) {
  },
  onReady (options) {
  },
  methods: {
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
    async getCoverData (coverId) {
      const db = wx.cloud.database()
      const invitation = db.collection('invitation')
      wx.showLoading({
        title: '加载中'
      })
      const openId = await this.getOpenId()
      let where

      if (typeof coverId === 'string') {
        where = {
          _id: coverId
        }
      } else {
        where = {
          _openid: openId
        }
      }
      invitation.where(where).get().then(res => {
        console.log(where, res)
        if (res.data.length !== 0) {
          const config = res.data[0]
          this.hasData = true
          wx.cloud.downloadFile({
            fileID: config.photo, // 文件 ID
            success: res => {
              // 返回临时文件路径
              console.log(res.tempFilePath)
              config.photo = res.tempFilePath
              this.myConfig = config
              wx.hideLoading()
              this.setMusicUrl(this.myConfig.music)
              this.setShareData({
                title: '邀请函',
                path: `/pages/index/main?coverId=${this.myConfig._id}`
              })
            },
            fail: (err) => {
              console.error(err)
              wx.hideLoading()
            }
          })
        } else {
          wx.hideLoading()
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    share () {
      // this.creating = false
      // wx.showShareMenu({
      //   withShareTicket: true,
      //   menus: ['shareAppMessage', 'shareTimeline'],
      //   success: () => {
      //     console.log('share success')
      //     this.creating = true
      //   }
      // })
      if (!this.myConfig._id) {
        tools.showToast(`需要点击制作`)
        return false
      }
    },
    createCover () {
      const TXT_MAP = {
        photo: '图片',
        // music: '',
        boy: '新娘名称',
        girl: '新娘名称',
        date: '日期',
        address: '地址'
      }
      let _key
      Object.keys(this.config).forEach(key => {
        if (!this.config[key]) {
          _key = key
        }
      })
      if (_key) {
        tools.showToast(`${TXT_MAP[_key]} 必填`)
      } else {
        const db = wx.cloud.database()
        const invitation = db.collection('invitation')
        this.loading = true
        if (this.hasData) {
          invitation.where({
            _openid: this.openId
          }).get().then(res => {
            console.log(res)
            if (res.data.length !== 0) {
              invitation.doc(this.res.data[0]._id).update({
                data: this.config
              }).then(res => {
                setTimeout(() => {
                  this.loading = false
                  tools.showToast(`制作成功并保存`)
                  this.setMusicUrl(this.myConfig.music)
                }, 1000)
              })
            }
          })
        } else {
          invitation.add({
            data: this.config
          }).then(res => {
            setTimeout(() => {
              this.loading = false
              tools.showToast(`制作成功并保存`)
              this.setMusicUrl(this.myConfig.music)
            }, 1000)
          })
        }
      }
    },
    transPhoto (direction) {
      if (typeof direction === 'string') {
        const dis = (direction === 'top' || direction === 'left') ? -2 : 2
        const key = (direction === 'top' || direction === 'bottom') ? 'top' : 'left'
        this.myConfig.photoStyle[key] = (this.myConfig.photoStyle[key] || 0) + dis
      } else {
        this.photoEditting = !this.photoEditting
      }
    },
    chooseImageTap () {
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: '#00000',
        success: (res) => {
          if (!res.cancel) {
            if (res.tapIndex === 0) {
              this.chooseWxImage('album')
            } else if (res.tapIndex === 1) {
              this.chooseWxImage('camera')
            }
          }
        }
      })
    },

    // 图片本地路径
    chooseWxImage: function (type) {
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: (chooseResult) => {
          console.log(chooseResult)
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
            // 指定上传到的云路径
            cloudPath: 'temp/' + 'my-photo.png',
            // 指定要上传的文件的小程序临时文件路径
            filePath: chooseResult.tempFilePaths[0],
            // 成功回调
            success: res => {
              console.log('上传成功', res)
              this.myConfig.photo = res.fileID
            }
          })
        }
      })
    },

    handleFileChange (e) {
      console.log(e)
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
    setMusicUrl (url) {
      if (url) {
        this.audioCtx.src = url
        this.audioCtx.play()
        this.isPlay = true
      }
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
        data: this.myConfig.address,
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
@import './Introduce.styl'
</style>
