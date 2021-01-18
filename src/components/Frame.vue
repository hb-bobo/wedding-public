<template>
    <div class="frame">
        <div
            v-for="(src, index) in list"
            :key="src"
        >

        <image
            v-show="current === index"
            class="frame-img" :src="src"
        />
        </div>
    </div>
</template>

<script>

export default {
  name: 'Form',
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      current: 0
    }
  },
  watch: {
    list () {
      if (this.list.length > 0) {
        this.current = 0
        this.run()
      }
    }
  },
  onShow () {
    this.run()
  },
  methods: {
    run () {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.timer = setInterval(() => {
        this.current++
      }, 1000)
    }
  }
}
</script>

<style lang="stylus">

</style>
