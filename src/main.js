import Vue from 'vue'
import App from './App.vue'

//引入router配置
import router from '../src/router/index.js';
// 高德地图
import VueAMap from 'vue-amap';
// element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入echarts
import echarts from 'echarts'

Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.use(echarts)
//注册高德
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'afa5c6aa403924178d79dee916785b87',
  plugin: ['AMap.Transfer', 'AMap.Walking', 'AMap.Driving', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});

new Vue({
  router,  //key名字必须命名为router
  render: h => h(App),
}).$mount('#app')
