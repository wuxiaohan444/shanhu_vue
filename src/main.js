import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './utils/rem'
import axios from 'axios'
import qs from 'qs'
import Calendar from 'vue-mobile-calendar'
import echarts from 'echarts'

const env = "prod";
const link = {
    dev: "http://118.25.172.29:6020",
    prod: "https://www.b156.com.cn/partner"
}[env];

Vue.prototype.fixedIp = function () {//固定ip
    return link
};

Vue.prototype.bus = new Vue;
Vue.prototype.$qs = qs;
export default function ajax(method, url, data, callback, headers, isQs) {
    this.bus.$emit('loading', true);
    let way = method === 'post' || method === 'POST' ? 'data' : 'params';
    isQs = isQs === false ? isQs : true;
    data = (method === 'post' || method === 'POST') && isQs ? qs.stringify(data) : data;
    let header = headers ? headers : 'application/x-www-form-urlencoded;charset=UTF-8';
    axios({
        method: method,
        url: url,
        [way]: data,
        headers: {
            'Content-Type': header,
            Authorization: localStorage.getItem("loginCode")
        }
    }).then((res) => {
        this.bus.$emit('loading', false);
        if (res.data.code === 0) {
            callback(res.data);
        } else {
            this.bus.$emit('tips', {
                show: true,
                title: res.data.data
            });
            setTimeout(() => {
                switch (res.data.code) {
                    case 1001:
                        router.push("/login");
                        break;
                }
            }, 500)
        }
    }).catch((res)=>{
        this.bus.$emit('loading', false);
        this.bus.$emit('tips', {
            show: true,
            title: '请稍后再试'
        });
    })
}


Vue.use(Calendar);
Vue.config.productionTip = false;
Vue.prototype.$axios = ajax;
Vue.prototype.$echarts = echarts;
new Vue({
    render: h => h(App),
    router,
}).$mount('#app');
