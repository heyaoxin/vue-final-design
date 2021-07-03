<template>
  <div>
    <!-- <p>{{msg}}</p>
    <button @click="addRadius">精度++</button>
    <hr> -->
    <div class="amap-wrapper">
      <el-amap class="amap-box" vid="map" 
        :zoom="zoom"
        :center="center" 
        :plugin="plugin">
        <el-amap-marker vid="marker" 
          :position="center" 
          :label="label"
           >
        </el-amap-marker>
        <el-amap-circle  vid="circle"
          :center="center" 
          :radius="radius" 
          fill-opacity="0.2"
          strokeColor="#38f"
          strokeOpacity="0.8"
          strokeWeight="1"
          fillColor="#38f"
          >
        </el-amap-circle>
      </el-amap>
    </div>
  </div>
</template>
<script>
export default {
  name:'home',
  data(){
    let vm=this;
    return{
      msg:'vue-amap demo',
      zoom:12,
      center:[119.515925, 32.199218],
      label:{
        content:'江苏大学',
        offset:[10,12]
      },
      radius:1000,
      plugin: [
        {
          pName: 'ToolBar',//工具条插件
          position:'LB',
        },
        {
          pName: 'MapType',//卫星与地图切换
          defaultType: 0,
          showTraffic:true,//实时交通图层
        },
        {
          pName:'OverView',
          //isOpen:true//鹰眼是否打开
        },
        {
          pName:'Scale'
        },
        {
          pName:'Geolocation',//定位插件
          showMarker:false,
          events:{
            init(o){
              //定位成功 自动将marker和circle移到定位点
              o.getCurrentPosition((status, result) => {
                console.log(result);
                vm.center=[result.position.lng,result.position.lat]
              });
            }
          }
        }
      ]
    }
  },
  methods:{
    addRadius(){
      this.radius+=100;
    }
  }
}
</script>
<style scoped>
.amap-wrapper{
  height: 600px;
  width: 100%;
}
</style>