import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";

Vue.config.productionTip = false
Vue.use(ElementUI);
//插件
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')



