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
    <el-button type="primary" @click="initPage()">导航</el-button>
    <el-button type="primary" @click="speak_start">播放</el-button>
    <el-button type="primary" @click="speak_stop">取消</el-button>
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
  lazyAMapApiLoaderInstance,
} from "vue-amap";
import VueAMap from "vue-amap";
let amapManager = new VueAMap.AMapManager();
export default {
  name: "demo",
  data() {
    let self = this;
    return {
      voice_source: [],
      input_start: "江苏大学图书馆",
      input_start_city: "镇江",
      input_end: "江苏大学三江楼",
      input_end_city: "镇江",
      amapManager,
      mapEvents: {
        // eslint-disable-next-line no-unused-vars
        init(o) {
          lazyAMapApiLoaderInstance.load().then(() => {
            self.initPage(); // 初始化数据self指向this
          });
        },
      },
    };
  },
  methods: {
    initPage() {
      let that = this;
      let o = that.amapManager.getMap();
      o.setMapStyle("amap://styles/macaron"); //自定义的高德地图的样式，我选的是马卡龙
      // eslint-disable-next-line no-undef
      let marker = new AMap.Marker({
        //点图标
        position: [116.379028, 39.865042],
      });
      o.setZoomAndCenter(16, [116.379028, 39.865042]);
      marker.setMap(o);
      o.plugin(["AMap.Walking"], function () {
        // eslint-disable-next-line no-undef
        var walking = new AMap.Walking({
          map: o,
          panel: "panel",
        });
        walking.search(
          [
            {
              keyword: that.input_start,
              city: that.input_start_city,
            },
            {
              keyword: that.input_end,
              city: that.input_end_city,
            },
          ],
          function (status, result) {
            // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
            if (status === "complete") {
              console.log("绘制驾车路线完成");
              that.voice_source = [];
              var steps = result["routes"][0]["steps"];
              for (let step of steps) {
                that.voice_source.push(step["instruction"]);
              }
            } else {
              console.log("获取驾车数据失败：" + result);
              alert("地址输入不规范");
            }
          }
        );
        o.clearMap();
        o.addControl(walking);
      });
    },
    speak_start() {
      for (let text of this.voice_source) {
        setTimeout(function () {
          // eslint-disable-next-line no-undef
          responsiveVoice.speak(text, "Chinese Female", { rate: 1 });
        }, 500);
      }
    },
    speak_stop() {
      // eslint-disable-next-line no-undef
      responsiveVoice.cancel();//取消朗读
    },
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