<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        unique-opened
        router
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :default-openeds="['1', '2']"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>交通态势</span> </template
          >·
          <el-menu-item-group>
            <el-menu-item index="/">城市拥堵指数</el-menu-item>
            <el-menu-item index="/traffic_index">城市实时拥堵详情</el-menu-item>
            <el-menu-item index="roadIndex">道路拥堵指数</el-menu-item>
            <!-- <el-menu-item index="1-3">选项3</el-menu-item>
            <el-menu-item index="1-4">选项4</el-menu-item> -->
          </el-menu-item-group>
        </el-submenu>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>出行导向</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="buslineDetail">公交线路详情查询</el-menu-item>
            <el-menu-item index="busNetSearch">公交网络查询</el-menu-item>
            <!-- <el-menu-item index="driving">出行规划</el-menu-item> -->
            <el-submenu index="2-2">
              <template slot="title">出行规划</template>
              <el-menu-item index="walking">步行</el-menu-item>
              <el-menu-item index="driving">驾驶</el-menu-item>
              <el-menu-item index="bus">公交</el-menu-item>
            </el-submenu>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
export default {
  methods: {
    // handleOpen(key, keyPath) {
    //   console.log(key, keyPath)
    // },
    // handleClose(key, keyPath) {
    //   console.log(key, keyPath)
    // },
    handleOpen() {},
    handleClose() {},
  },
};
</script>