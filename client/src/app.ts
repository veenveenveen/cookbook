import Vue from 'vue'
import Taro, { Config } from '@tarojs/taro'
// vuex
import store from './store'
// UI库
import taroUI from "taro-ui-vue";
Vue.use(taroUI);

import './app.scss'

const App = {
  store,
  mounted () {
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init()
    }
  },
  onShow (options: any) {
  },
  render(h: any) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
}

export default App
