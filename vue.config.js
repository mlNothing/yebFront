let proxyObj = {}
proxyObj['/'] = {
    //websocket
    ws: false,
    //目标地址
    target: 'http://localhost:8081',
    //发送请求头中host会设置成target
    changeOrigin: true,
    pathRewrite: {
        '^/': '/'
   }
}

proxyObj['/'] = {
    //websocket
    ws: true,
    //目标地址
    target: 'ws://localhost:8081'
}
    module.exports = {
        devServer: {
            host: 'localhost',
            port: 8080,
            proxy: proxyObj
    }
    }

// 配置请求转发解决跨域问题