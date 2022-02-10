import Vue from 'vue'
import Vuex from 'vuex'

// Vuex是一个专为vue.js应用程序开发的状态管理模式，它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证相应的规则保证状态以
// 一种可预测的方式发生改变 。该文件是配置vuex,然后添加到main.js
Vue.use(Vuex)
const now = new Date();

const store = new Vuex.Store({
    state:{
        routes:[],
        sessions:[{
            id:1,
            user:{
                name:'示例介绍',
                img:'../src/assets/images/2.png'
            },
            messages:[{
                content:'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
                date:now
            },{
                content:'项目地址(原作者): https://github.com/coffcer/vue-chat',
                date:now
            },{
                content:'本项目地址(重构): https://github.com/is-liyiwei',
                date:now
            }]
        },{
            id:2,
            user:{
                name:'webpack',
                img:'../src/assets/images/3.jpg'
            },
            messages:[{
                content:'Hi，我是webpack哦',
                date:now
            }]
        }],
        currentSessionId:1,
        filterKey:''
    },
    mutations:{
        initRoutes(state,data){
            state.routes=data;
        },
        changeCurrentSessionId (state,id) {
			state.currentSessionId = id;
		},
		addMessage (state,msg) {
			state.sessions[state.currentSessionId-1].messages.push({
				content:msg,
				date: new Date(),
				self:true
			})
		},
        INIT_DATA (state) {
        let data = localStorage.getItem('vue-chat-session');
        //console.log(data)
        if (data) {
            state.sessions = JSON.parse(data);
        }
        }
    },
    actions:{
        initData (context) {
            context.commit('INIT_DATA')
          }
    }
})
store.watch(function (state) {
    return state.sessions
  },function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
  },{
    deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
  })
  
  
  export default store;
/**
 * state:全局state对象，用于保存所有组件的公共数据
 * getters:监听state的最新状态（计算属性）
 * mutations:唯一可以改变state值的方法（同步执行）
 * actions:异步执行mutations
 */

