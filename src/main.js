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
import 'font-awesome/css/font-awesome.min.css'
Vue.config.productionTip = false
Vue.use(ElementUI);
//插件
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;


// router.beforeEach((to, from, next)=>{
//   if (to.path=='/'){
//       next()
//   } else {
//       initMenu(router,store);
//       next();
//   }
// })


// 前登录时只是获取用户token，并没有获取用户信息进行展示。我们可以在全局前置守卫时获取用户
// 信息并存储在 SessionStorage 中方便使用
router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem("tokenStr")) {
      initMenu(router, store);
      if (!window.sessionStorage.getItem("user")) {
          return getRequest('/admin/info').then(resp => {
              if (resp) {
                  //存入用户信息
                  window.sessionStorage.setItem("user", JSON.stringify(resp));
                  next();
             }
         });
     }
      next();
 } else {
      if (to.path == '/') {
          next();
     }
 }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



