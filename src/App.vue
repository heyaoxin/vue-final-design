<template>
  <div id="app">
    <el-container>
      <el-header class="header" style="margin-top: -5px; margin-left: -8px; margin-right: -8px">
        <vheader />
      </el-header>
      <el-container>
        <el-aside width="200px" style="margin-left: -8px">
          <navmenu></navmenu>
        </el-aside>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavMenu from "@/components/NavMenu";
import Header from "@/components/Header";

export default {
  name: "app",
  components: {
    navmenu: NavMenu,
    vheader: Header,
  },
};
</script>

<style>
.header {
  background-color: #409eff;
  color: #fff;
  line-height: 60px;
}
</style>
