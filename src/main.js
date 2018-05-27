import Vue from 'vue'
import App from './App'
import router from './router'
import storage from '@/util/storage'
import ui from './components/index'

Vue.prototype.$storage = storage

Vue.use(ui)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {App}
})
