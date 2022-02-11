import Vue from 'vue'
import Vuex from 'vuex'
import {getRequest} from "../utils/api";
import SockJS from 'sockjs-client' // 2-1 在线聊天-导入下载的在线聊天依赖
import Stompp from 'stompjs' // 2-1 在线聊天-导入下载的在线聊天依赖
import {Notification} from 'element-ui';

Vue.use(Vuex)
const now = new Date();

const store = new Vuex.Store({
    state:{
        routes: [],
        sessions: {},
        // sessions: [],
        // 1-1 用来接收后端接口返回的数据
        admins: [],
        currentAdmin: JSON.parse(window.sessionStorage.getItem('user')), // 当前用户
        currentSession: null,
        // currentSession: -1,
        filterKey: '',
        stomp: null, // 2-2 在线聊天-定义对象
        idDot: {} // 未读消息 对象
    },
    mutations:{
        // 编辑用户 同步用户信息
        INIT_ADMIN(state, admin) {
            state.currentAdmin = admin
        },
        initRoutes(state,data){
            state.routes=data;
        },
        changeCurrentSession (state,currentSession) {
			state.currentSession = currentSession;
            Vue.set(state.idDot, state.currentAdmin.username + '#' + state.currentSession.username, false)
		},
		addMessage (state,msg) {
            let mss = state.sessions[state.currentAdmin.username + '#' + msg.to]
            if (!mss) {
                // state.sessions[state.currentAdmin.username + '#' + msg.to] = []
                Vue.set(state.sessions, state.currentAdmin.username + '#' + msg.to, [])
            }
            state.sessions[state.currentAdmin.username + '#' + msg.to].push
            ({
                content: msg.content,
                date: new Date(),
                self: !msg.notSelf // 不是自己
            })
        },
        INIT_DATA (state) {
            //浏览器本地的历史聊天记录
        let data = localStorage.getItem('vue-chat-session');
        if (data) {
            state.sessions = JSON.parse(data);
        }
        },
        INIT_ADMINS(state,data){
            state.admins=data
        }
    },
    actions:{
        connect(context) {
            context.state.stomp = Stompp.over(new SockJS('/ws/ep')) // 连接端点
            let token = window.sessionStorage.getItem('tokenStr')
            context.state.stomp.connect({'Auth-Token': token}, success => { // 把 token 放进去
                context.state.stomp.subscribe('/user/queue/chat', msg => { // 订阅消息频道
                    let receiveMsg = JSON.parse(msg.body)
                   // 有消息发来，右下角 弹框提示
                    if (!context.state.currentSession || receiveMsg.from !== context.state.currentSession.username) {
                        Notification.info({
                            title: '【' + receiveMsg.fromNickName + '】发来一条消息',
                            message: receiveMsg.content.length > 10 ? receiveMsg.content.substr(0, 10) : receiveMsg.content,
                            position: 'bottom-right'
                        })
                        // 有未读消息 展示小红点
                        Vue.set(context.state.idDot, context.state.currentAdmin.username + '#' + receiveMsg.from, true)
                    }
                    receiveMsg.notSelf = true;
                    receiveMsg.to = receiveMsg.from
                    context.commit('addMessage', receiveMsg) // 接收
                })
            }, error => {
            })
        },
        initData (context) {
            // 获取之前的聊天记录 在缓存中
            context.commit('INIT_DATA')
            getRequest('chat/admin?keyword=').then(resp=>{
                if(resp){
                    context.commit('INIT_ADMINS',resp)
                }
            })
           
          }
    }
})
store.watch(function (state) {
    return state.sessions
  },function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
  },{
    deep:true
  })
  
  
  export default store;
/**
 * state:全局state对象，用于保存所有组件的公共数据
 * getters:监听state的最新状态（计算属性）
 * mutations:唯一可以改变state值的方法（同步执行）
 * actions:异步执行mutations
 */

