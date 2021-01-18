<template>
  <div class="bg-box" :class="{inline: inline}" :style="style" @click.stop="$emit('click')">
      <slot></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { transUrl } from './util'
import { getUrlByType } from '@/constant'
export default {
  name: 'bg-box',
  props: {
    /** 样式覆盖 */
    _style: Object,
    /* 图片url */
    src: String,
    /** 大小 同下面两个属性，二选一*/
    size: Array,
    width: [String, Number],
    height: [String, Number],
    imgName: String, // 图片的名称：明星不同背景时用此属性。替代src。根据 @/constant/index中的路径匹配图片地址
    /**
     * 自动转换为实际px
     */
    autoTransform: {
      type: Boolean,
      default: true,
    },
    inline: {
        type: Boolean,
        default: false,
    },
  },
  computed: {
    ...mapState({
      starType: state => state.common.starType
    }),
    style() {
      let width
      let height
      let imgUrl = ''
      if (this.size) {
        width = this.size[0]
        height = this.size[1]
      } else {
        width = this.width
        height = this.height
      }
      if (this.imgName) {
          imgUrl = this.getImgUrl()
      } else {
          imgUrl = transUrl(this.src, this.starType)
      }
      const style = {
        backgroundImage: `url(${imgUrl})`
      }
      if (this.trans(width) > 0) {
        style.width = this.trans(width) + 'px'
        style.height = this.trans(height) + 'px'
      }
      if (this._style) {
        return Object.assign(style, this._style)
      }
      return style
    },
  },
  methods: {
    trans(val) {
      if (this.autoTransform && window.autoRem.stdPxToPx) {
        return window.autoRem.stdPxToPx(Number(val))
      }
      return Number(val)
    },
    getImgUrl() {
        return getUrlByType(this.starType, this.imgName);
    }
  }
}
</script>

<style lang="less">
.bg-box{
  background-size: 100% 100%;
  &.inline{
      display: inline-block;
  }
}
</style>