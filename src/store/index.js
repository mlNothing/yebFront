import Vue from 'vue'
import Vuex from 'vuex'

// Vuex是一个专为vue.js应用程序开发的状态管理模式，它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证相应的规则保证状态以
// 一种可预测的方式发生改变 。该文件是配置vuex,然后添加到main.js
Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        routes:[]
    },
    mutations:{
        initRoutes(state,data){
            state.routes=data;
        }
    },
    actions:{}
})

/**
 * state:全局state对象，用于保存所有组件的公共数据
 * getters:监听state的最新状态（计算属性）
 * mutations:唯一可以改变state值的方法（同步执行）
 * actions:异步执行mutations
 */

