<template>
    <div class="photo" v-if="isMock === false">
        <!-- <h-swiper :list="list" :isGif="isGif"></h-swiper> -->
        <AlbumSwiper :list="list"></AlbumSwiper>
        
    </div>
</template>

<script>
import HSwiper from 'components/swiper'
import AlbumSwiper from 'components/AlbumSwiper'
// import tools from 'common/js/h_tools'
import config from 'common/js/config'
export default {
  name: 'Photo',
  components: {
    HSwiper,
    AlbumSwiper
  },
  data () {
    return {
      list: []
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
    config () {
      wx.setNavigationBarTitle({
        title: this.config.barTitle.photo
      })
    }
  },
  onShow () {
    // this.isGif = !this.isGif
    wx.setNavigationBarTitle({
      title: this.config.barTitle.photo
    })
    this.getList()
  },
  methods: {
    getList () {
      wx.showNavigationBarLoading()
      const db = wx.cloud.database()
      const album = db.collection('album')
      album.get().then(res => {
        if (!Array.isArray(res.data) || res.data.length === 0) {
          return
        }
        this.list = res.data
        wx.hideNavigationBarLoading()
      })
    }
  }
}
</script>

<style lang="stylus" scoped>

#myAudio
  display none
.photo
    height 100%


</style>

