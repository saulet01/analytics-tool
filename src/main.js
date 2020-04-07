import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
// import html2canvas from "html2canvas"
import VueHtml2Canvas from 'vue-html2canvas';
// window.html2canvas = html2canvas;

Vue.config.productionTip = false

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app')

Vue.use(VueHtml2Canvas);