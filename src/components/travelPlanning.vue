<template>
  <div id="demo" class="amap-wrapper">
    <el-input
      placeholder="起点.."
      prefix-icon="el-icon-search"
      v-model="input_start"
      style="width: 150px; margin-right: 20px"
    ></el-input>
    <el-input
      placeholder="起点城市"
      prefix-icon="el-icon-search"
      v-model="input_start_city"
      style="width: 150px; margin-right: 20px"
    ></el-input>
    <el-input
      placeholder="终点.."
      prefix-icon="el-icon-search"
      v-model="input_end"
      style="width: 150px; margin-right: 20px"
    ></el-input>
    <el-input
      placeholder="终点城市"
      prefix-icon="el-icon-search"
      v-model="input_end_city"
      style="width: 150px; margin-right: 20px"
    ></el-input>
    <el-button type="primary" @click="handleClick">导航</el-button>
    <el-divider style="margin-top: -30px; margin-bottom: -20px"></el-divider>
    <el-amap
      vid="amapDemo"
      :amap-manager="amapManager"
      :events="mapEvents"
      class="amap-demo"
    >
    </el-amap>
    <div id="panel" class="panel"></div>
  </div>
</template>

<script>
import {
  // eslint-disable-next-line no-unused-vars
  AMapManager,
} from "vue-amap";
import VueAMap from "vue-amap";
let amapManager = new VueAMap.AMapManager();
export default {
  name: "demo",
  data() {
    return {
      input_start: "江苏大学",
      input_start_city: "镇江",
      input_end: "江苏大学",
      input_end_city: "万达广场",
      amapManager,
      mapEvents: {
        init(o) {
          o.setMapStyle("amap://styles/macaron"); //自定义的高德地图的样式，我选的是马卡龙
          // eslint-disable-next-line no-undef
          let marker = new AMap.Marker({
            //点图标
            position: [116.379028, 39.865042],
          });
          o.setZoomAndCenter(16, [116.379028, 39.865042]);
          marker.setMap(o);
          o.plugin(["AMap.Driving"], function () {
            // eslint-disable-next-line no-undef
            var driving = new AMap.Driving({
              map: o,
              panel: "panel",
            });
            //位置经纬度+ 驾车路线规划
            //参考连接： https://lbs.amap.com/api/javascript-api/example/driving-route/plan-route-according-to-lnglat
            //官方文档说明： https://lbs.amap.com/api/javascript-api/reference/route-search#m_AMap.Driving
            // driving.search(new AMap.LngLat(116.379028, 39.865042), new AMap.LngLat(116.427281, 39.903719), function(status, result) {
            //   if (status === 'complete') {
            //     console.log('绘制成功');
            //   } else {
            //     console.log('绘制失败', result);
            //   }
            // });
            //地点关键字+ 驾车路线规划
            driving.search(
              [
                {
                  keyword: "江苏大学",
                  city: "镇江",
                },
                {
                  keyword: "万达广场",
                  city: "镇江",
                },
              ],
              function (status, result) {
                // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
                if (status === "complete") {
                  console.log("绘制驾车路线完成");
                } else {
                  console.log("获取驾车数据失败：" + result);
                  alert("地址输入不规范");
                }
              }
            );
            o.addControl(driving);
          });
        },
      },
    };
  },
  methods: {
    resetMap() {},
  },
};
</script>
<style scoped>
.amap-wrapper {
  height: 650px;
  width: 100%;
}
.panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  top: 10px;
  right: 10px;
  width: 280px;
}
</style>