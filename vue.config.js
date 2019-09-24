const env = "prod";
const link = {
    dev: "http://118.25.172.29:6020",
    prod: "https://www.b156.com.cn/partner"
}[env];
module.exports = {
    lintOnSave: true,
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 32, // 换算的基数
                        selectorBlackList: ['weui', 'mu', 'wh'], // 忽略转换正则匹配项
                        propList: ['*'],
                    }),
                ]
            }
        }
    },
    publicPath: './',
    devServer: {
        open: true,
        https: false,
        hotOnly: false,
        proxy: {
            '/partner': {
                target: link,
                ws: false,
                changOrigin: true,
                pathRewrite: {
                    '^/partner': ''//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
                }
            }
        },
        before: app => {
        }
    },
    configureWebpack: {
        externals: {
            "BMap": "BMap"
        }
    }
};