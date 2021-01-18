import Vue from 'vue'
import App from './App'
import store from './store'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'

wx.cloud.init({
  env: '填自己申诉的id'
})

const db = wx.cloud.database()
const config = db.collection('config').where({})
config.get().then(res => {
  if (!Array.isArray(res.data) || res.data.length === 0) {
    return
  }
  store.commit('setConfig', res.data[0])
})

const app = new Vue(App)
app.$mount()
