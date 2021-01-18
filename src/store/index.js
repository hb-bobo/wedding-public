import Vuex from 'vuex'
import Vue from 'vue'
import config from 'common/js/config'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    isMock: undefined,
    configKey: 'prod',
    date: '',
    receiverNick: '',
    receiverPhone: 0,
    currentUserInfo: undefined,
    shareId: ''
  },
  mutations: {
    // setConfig (state, payload) {
    //   state.isMock = payload
    //   state.configKey = payload ? 'mock' : 'prod'
    // },
    setConfig (state, payload) {
      state.isMock = payload.aa === 1
      state.configKey = payload.aa === 1 ? 'mock' : 'prod'
      state.receiverNick = payload.receiverNick
      state.receiverPhone = payload.receiverPhone
      state.date = payload.date
      state.share = payload.share
      if (state.isMock === true || state.isMock === undefined) {
        wx.hideTabBar()
      } else {
        wx.showTabBar()

        const barTitle = config[state.configKey].barTitle
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
    },
    setCurrentUserInfo (state, payload) {
      state.currentUserInfo = payload
    },
    setShareId (state, payload) {
      state.shareId = payload
    }
  }
})

export default store
