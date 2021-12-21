import { getRequest } from "./api";

/**
 * 封装菜单请求工具类
 * 
 * 后端启动菜单需要redis
 * 
 * 后端接口返回的数据中component的值为String,我们需要将器转换为前端所需的对象并且我们需要将数据放入到路由的配置里，
 * 所有我们需要封装菜单请求工具类来实现我们的需求。
 */

export const initMenu=(router,store)=>{
    if(store.state.router.length>0){
        return;
    }
    getRequest("/system/config/menu").then(data=>{
        if(data){
            // 格式化route
            let fmtRoutes=formatRoutes(data);
            // 添加到route
            router.addRoutes(fmtRoutes);
            // 将数据存入到vuex
            store.commit('initRoutes',fmtRoutes);
        }
    })
}

export const formatRoutes=(routes)=>{
    let fmtRoutes=[];
    routes.forEach(router=>{
        let {
            path,
            component,
            name,
            meta,
            iconCls,
            children
        }=router;

        if(children&& children instanceof Array){
            // 递归
            children=formatRoutes(children);
        }
    let fmtRouter={
        path:path,
        name:name,
        meta:meta,
        iconCls:iconCls,
        children:children,
        component(resolve){
            if (component.startsWith("Emp")) {
                require(['../views/emp/' + component + '.vue'], resolve);
           } else if (component.startsWith("Per")) {
                require(['../views/per/' + component + '.vue'], resolve);
           } else if (component.startsWith("Sal")) {
                require(['../views/sal/' + component + '.vue'], resolve);
           } else if (component.startsWith("Sta")) {
                require(['../views/sta/' + component + '.vue'], resolve);
           } else if (component.startsWith("Sys")) {
                require(['../views/sys/' + component + '.vue'], resolve);
           }
        }
    }
    formatRoutes.push(fmtRouter);
    })
        return fmtRoutes;
}