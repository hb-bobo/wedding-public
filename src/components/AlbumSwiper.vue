<template>
    <div class="box">
        <swiper
            class="swiper"
            :autoplay="true"
            :circular="true"
            current=0
            :indicator-dots="true"
            :vertical="true"
        >
            <block v-for="(item, index) in list" :key="index">
                <swiper-item class="item" v-if="item.src">

                    <div class="inv" >
                        <image  lazy-load="true" src="../../static/images/inv.png"/>
                    </div>
                    <!-- <p class="inv">WEDDING</p> -->
                    <image mode="aspectFill" lazy-load="true" :src="item ? item.src : ''" class="slide-image"/>

                </swiper-item>
                <swiper-item class="item" v-if="item.list">
                    <div style="display:flex; flex-direction:column;height: 100%">
                        <image
                            v-for="(src, j) in item.list" 
                            :key="src"
                            lazy-load="true" 
                            mode="aspectFill"
                            :src="src ? src : ''"
                            class="slide-image"
                            style="flex: 1"
                        />
                        <div class="inv" :style="{top: 100/item.list.length + '%', marginTop: '-30rpx'}">
                            <image  lazy-load="true" src="../../static/images/inv.png"/>
                            <!-- <image
                                style="width: 200px; height: 200px; color: #fffff"
                                src="https://cutthatdesign.com/wp-content/uploads/2019/05/1444-Welcome-to-our-Wedding.png"
                            /> -->
                        </div>
                    </div>
                </swiper-item>
                <swiper-item class="item" v-if="item.frames">
                    <div style="display:flex; flex-direction:column;height: 100%">
                        <image
                            v-for="(src, j) in item.list" 
                            :key="src"
                            lazy-load="true" 
                            mode="aspectFill"
                            :src="src ? src : ''"
                            class="slide-image"
                            style="flex: 1"
                        />
                        <div class="inv" :style="{top: 100/item.list.length + '%', marginTop: '-30rpx'}">
                            <image  lazy-load="true" src="../../static/images/inv.png"/>
                            <!-- <image
                                style="width: 200px; height: 200px; color: #fffff"
                                src="https://cutthatdesign.com/wp-content/uploads/2019/05/1444-Welcome-to-our-Wedding.png"
                            /> -->
                        </div>
                    </div>
                </swiper-item>
            </block>
        </swiper>
    </div>
</template>

<script>
export default {
  name: 'GoodSwiper',
  props: ['list']
}
</script>

<style lang="stylus">
.box
    position relative
    height 100%
    .swiper
        height 100%
        width 100%
        .item
            position relative
            width 100%
            height 100%
            image
                width 100%
                height 100%
                display block
        .inv
            position absolute
            top 20rpx
            left 89rpx
            z-index 9
            image
                width 572rpx
                height 69rpx
            // color  #ffffff
            // font-size 40px
            // font-weight 600
</style>
