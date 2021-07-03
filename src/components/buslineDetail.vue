<template>
  <div>
    <el-input
      placeholder="请输入城市"
      prefix-icon="el-icon-search"
      v-model="input_city"
      style="width: 200px; margin-right: 20px"
    ></el-input>
    <el-input
      placeholder="请输入公交线路"
      prefix-icon="el-icon-search"
      v-model="input_line"
      style="width: 200px; margin-right: 20px"
    ></el-input>
    <el-button type="primary" @click="handleClick">查询</el-button>
    <el-button type="primary" @click="getMap">查看地图</el-button>
    <br />
    <br />
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="always" style="height: auto">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            公交线路详情查询
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <span style="margin-top: -30px">公交线路名称: </span>
          <span
            v-text="name"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <span style="margin-top: -30px; margin-left: 25px">所属公司: </span>
          <span
            v-text="company"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <span style="margin-top: -30px; margin-left: 25px">公交类型: </span>
          <span
            v-text="type"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <span style="margin-top: -30px; margin-left: 25px">参考票价: </span>
          <span
            v-text="basic_price"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <span style="margin-top: -30px; margin-left: 25px">全程票价: </span>
          <span
            v-text="total_price"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <br />
          <br />
          <span style="margin-top: -30px">首发站: </span>
          <span
            v-text="start_stop"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <span style="margin-top: 10px; margin-left: 25px">首班车时间: </span>
          <span
            v-text="start_time"
            style="font-size: 20px; margin-top: 10px; margin-bottom: 5px"
          ></span>
          <span style="margin-top: 10px; margin-left: 25px">终点站: </span>
          <span
            v-text="end_stop"
            style="font-size: 20px; margin-top: 10px; margin-bottom: 5px"
          ></span>
          <span style="margin-top: 10px; margin-left: 25px">末班车时间: </span>
          <span
            v-text="end_time"
            style="font-size: 20px; margin-top: 10px; margin-bottom: 5px"
          ></span>
          <el-divider
            style="margin-top: -30px; margin-bottom: -50px"
          ></el-divider>
          <el-table
            :data="table_data"
            stripe
            cell-style="font-weight: 700;"
            header-cell-style="color:#232323"
            style="width: 100%; font-size: 15px; color: #232323"
            height="400px"
          >
            <el-table-column prop="id" label="id" width="auto">
            </el-table-column>
            <el-table-column prop="name" label="站点名称" width="auto">
            </el-table-column>
            <el-table-column prop="location" label="站点定位" width="auto">
            </el-table-column>
            <el-table-column prop="sequence" label="站点顺序" width="auto">
            </el-table-column>
          </el-table>
          <br />
          <el-divider
            style="margin-top: 30px; margin-bottom: 20px"
          ></el-divider>
          <img :src="src" style="display: block; margin: 0 auto" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { url } from "../apis/urls";
import axios from "axios";

export default {
  data() {
    return {
      input_city: "镇江",
      input_line: "19",

      // 公交基本信息
      name: "",
      basic_price: "",
      company: "",
      end_stop: "",
      end_time: "",
      start_stop: "",
      start_time: "",
      type: "",
      total_price: "",

      // 表格数据
      table_data: [],

      // 地图连线
      locations: [],
      locationStr: "",
      src: "",
    };
  },
  mounted: function () {
    // 初始化页面显示镇江交通态势
    this.getChartsData();
  },
  methods: {
    handleClick: function () {
      // 点击按钮，查询指定城市交通态势数据
      this.getChartsData();
    },
    getChartsData: function () {
      var that = this;
      axios
        .get(url["busline_detail"], {
          params: {
            city: that.input_city,
            line: that.input_line,
          },
        })
        .then(function (response) {
          var data = response.data["buslines"][0];
          // 提取公交基本信息
          that.name = data["name"];
          that.company = data["company"];
          that.basic_price = data["basic_price"];
          that.total_price = data["basic_price"];
          that.type = data["type"];
          that.start_stop = data["start_stop"];
          that.start_time = data["start_time"];
          that.start_time =
            that.start_time[0] +
            that.start_time[1] +
            ":" +
            that.start_time[2] +
            that.start_time[3];
          that.end_stop = data["end_stop"];
          that.end_time = data["end_time"];
          that.end_time =
            that.end_time[0] +
            that.end_time[1] +
            ":" +
            that.end_time[2] +
            that.end_time[3];

          // 提取表格信息
          that.table_data = [];
          that.locations = [];
          for (let one of data["busstops"]) {
            that.table_data.push({
              id: one["id"],
              name: one["name"],
              sequence: one["sequence"],
              location: one["location"],
            });
            that.locations.push(one["location"]);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    getMap: function () {
      this.locationStr = "";
      this.locationStr = this.locations.join(";");
      var that = this;
      axios
        .get(url["line_map"], {
          responseType: "arraybuffer", // 最为关键
          params: {
            locations: that.locationStr,
          },
        })
        .then(function (response) {
          that.src =
            "data:image/jpeg;base64," + that.arrayBufferToBase64(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    arrayBufferToBase64: function (buffer) {
      var binary = "";
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
  },
};
</script>