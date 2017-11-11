// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import iView from 'iview'
import moment from 'moment'
import vueMoment from 'vue-moment'
import 'iview/dist/styles/iview.css'
window.moment = moment
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(iView)
Vue.use(vueMoment)

axios.interceptors.response.use(
  response => {
    if (response.data.code === 601) {
      router.replace({
        path: '/admin/login'
      })
    }
    return response
  },
  error => {
    return Promise.reject(error.response.data)
  })

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  next()
})

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
