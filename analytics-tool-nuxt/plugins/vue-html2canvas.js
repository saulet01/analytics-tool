import Vue from 'vue'
import VueHtml2Canvas from 'vue-html2canvas';
import saveSvgAsPng from 'save-svg-as-png';
// window.saveSvgAsPng = saveSvgAsPng;

Vue.use(VueHtml2Canvas);
Vue.use(saveSvgAsPng);
