import { createApp } from 'vue'
import { globalRegister } from '@/global/index'
import './service/axios_demo'
import hyRequest from './service/index'

import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(globalRegister)
app.use(router)
app.use(store)
app.mount('#app')

console.log(process.env.VUE_APP_BASE_URL)
console.log(process.env.VUE_APP_BASE_NAME)

hyRequest.request({
  url: '/home/multidata',
  method: 'GET',
  showLoading: false,
  interceptors: {
    requestInterceptor: (config) => {
      console.log('单独请求的config')
      return config
    },
    responseInterceptor: (res) => {
      console.log('单独响应的response')
      return res
    }
  }
})

// hyRequest.request({
//   url: '/home/multidata',
//   method: 'GET'
// })
