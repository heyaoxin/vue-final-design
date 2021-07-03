<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always" style="height: 600px">
          <iframe
            :src="this.url"
            frameborder="0"
            width="100%"
            height="500px"
            scrolling="auto"
          ></iframe>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  data() {
    return {
      url: "http://127.0.0.1:5000/all_index",
    };
  },
};
</script>