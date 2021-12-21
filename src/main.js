import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import {postRequest} from "./utils/api";
import {putRequest} from "./utils/api";
import {getRequest} from "./utils/api";
import {deleteRequest} from "./utils/api";
import {initMenu} from "./utils/menus";

Vue.config.productionTip = false
Vue.use(ElementUI);
//插件
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;


router.beforeEach((to, from, next)=>{
  if (to.path=='/'){
      next()
  } else {
      initMenu(router,store);
      next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



