import Vue from 'vue';
import Router from 'vue-router';
import login from "@/pages/login";
import index from "@/pages/index";
import operation from "@/pages/operation/operation";

// 商品管理
import goods from "@/pages/goods/goods"
import goodsAdd from "@/pages/goods/goodsAdd"
import goodsClass from "@/pages/goods/goodsClass"
// 订单管理
import order from "@/pages/order/order"
import orderDetails from "@/pages/order/orderDetails"
//数据分析
import data from "@/pages/data/data"
import deviceList from "@/pages/data/deviceList"
// 设备管理
import device from "@/pages/device/device"
import monitor from "@/pages/device/monitor"
import configuration from "@/pages/device/configuration"
import inventory from "@/pages/device/inventory"
import manList from "@/pages/device/manList"
import measurement from "@/pages/device/measurement"
//补货员
import replenishment from "@/pages/replenishment/replenishment"
import addMan from "@/pages/replenishment/addMan"
import manifest from "@/pages/replenishment/manifest"
import allocation from "@/pages/replenishment/allocation"
// 个人中心
import my from "@/pages/my/my";
import personage from "@/pages/my/personage";
import password from "@/pages/my/password";


Vue.use(Router);
export default new Router({
    base: '/',
    // mode: 'history',
    routes: [
        {
            path: '/login',
            name: 'login',
            component: login
        }, {
            path: '/',
            name: 'index',
            component: index
        }, {
            path: '/operation',
            name: 'operation',
            component: operation
        }, {
            path: '/my',
            name: 'my',
            component: my
        }, {
            path: '/personage',
            name: 'personage',
            component: personage
        }, {
            path: '/password',
            name: 'password',
            component: password
        }, {
            path: '/goods',
            name: 'goods',
            component: goods
        }, {
            path: '/goodsAdd',
            name: 'goodsAdd',
            component: goodsAdd
        }, {
            path: '/goodsClass',
            name: 'goodsClass',
            component: goodsClass
        }, {
            path: '/order',
            name: 'order',
            component: order
        }, {
            path: '/orderDetails',
            name: 'orderDetails',
            component: orderDetails
        }, {
            path: '/data',
            name: 'data',
            component: data
        }, {
            path: '/deviceList',
            name: 'deviceList',
            component: deviceList
        },{
            path: '/device',
            name: 'device',
            component: device
        }, {
            path: '/monitor',
            name: 'monitor',
            component: monitor
        }, {
            path: '/configuration',
            name: 'configuration',
            component: configuration
        }, {
            path: '/inventory',
            name: 'inventory',
            component: inventory
        }, {
            path: '/manList',
            name: 'manList',
            component: manList
        },{
            path:'/measurement',
            name:'measurement',
            component:measurement
        }, {
            path: '/replenishment',
            name: 'replenishment',
            component: replenishment
        }, {
            path: '/addMan',
            name: 'addMan',
            component: addMan
        }, {
            path: '/manifest',
            name: 'manifest',
            component: manifest
        }, {
            path: '/allocation',
            name: 'allocation',
            component: allocation
        }
    ]
})