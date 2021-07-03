import Vue from 'vue'   //引入Vue
import Router from 'vue-router'  //引入vue-router

//引入的组件
import TrafficIndex from '../components/trafficIndex.vue'
import RoadIndex from '../components/roadIndex.vue'
import BuslineDetail from '../components/buslineDetail.vue'
import BusNetSearch from '../components/busNetSearch.vue'
import Driving from '../components/driving.vue'
import Bus from '../components/bus.vue'
import Walking from '../components/walking.vue'
import Home from '../components/home.vue'
import AllIndex from '../components/all_cities_index.vue'

Vue.use(Router)  //Vue全局使用Router

export default new Router({
    // mode: 'hash',
    routes: [              //配置路由，这里是个数组
        // {                    //每一个链接都是一个对象
        //     path: '/home',         //链接路径  // path 设置为 “/” ，默认显示该页面
        //     name: 'home',     //路由名称，
        //     component: Home   //对应的组件模板
        // },
        {
            path: '/home',
            name: 'home',
            component: Home
        },
        {
            path: '/traffic_index',
            name: 'trafficIndex',
            component: TrafficIndex
        },
        {
            path: '/roadIndex',
            name: 'roadIndex',
            component: RoadIndex
        },
        {
            path: '/buslineDetail',
            name: 'buslineDetail',
            component: BuslineDetail
        },
        {
            path: '/busNetSearch',
            name: 'busNetSearch',
            component: BusNetSearch
        },
        {
            path: '/driving',
            name: 'driving',
            component: Driving
        },
        {
            path: '/walking',
            name: 'walking',
            component: Walking
        },
        {
            path: '/bus',
            name: 'bus',
            component: Bus
        },
        {
            path: '/',
            name: 'all_index',
            component: AllIndex
        },
    ]
})