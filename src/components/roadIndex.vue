<template>
  <div>
    <el-input
      placeholder="请输入城市"
      prefix-icon="el-icon-search"
      v-model="input_city"
      style="width: 200px; margin-right: 20px"
    ></el-input>
    <el-button type="primary" @click="handleClick">查询</el-button>
    <br />
    <br />
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="always" style="height: 500px">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            全部道路拥堵情况top10
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <el-table
            :data="all_road_data"
            stripe
            cell-style="font-weight: 700;"
            header-cell-style="color:#232323"
            style="width: 100%; font-size: 15px; color: #232323"
            height="400px"
          >
            <el-table-column prop="date" label="日期(年月日时分)" width="180">
            </el-table-column>
            <el-table-column prop="name" label="道路名称" width="180">
            </el-table-column>
            <el-table-column prop="address" label="道路走向" width="280">
            </el-table-column>
            <el-table-column prop="index" label="拥堵指数" width="auto">
            </el-table-column>
            <el-table-column prop="index_level" label="拥堵等级" width="auto">
            </el-table-column>
            <el-table-column prop="speed" label="时速" width="auto">
            </el-table-column>
            <el-table-column prop="yongdu_length" label="拥堵长度" width="auto">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="always" style="height: 500px">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            高速/快速公路拥堵情况top10
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <el-table
            :data="high_road_data"
            stripe
            cell-style="font-weight: 700;"
            header-cell-style="color:#232323"
            style="width: 100%; font-size: 15px; color: #232323"
            height="400px"
          >
            <el-table-column prop="date" label="日期(年月日时分)" width="180">
            </el-table-column>
            <el-table-column prop="name" label="道路名称" width="180">
            </el-table-column>
            <el-table-column prop="address" label="道路走向" width="280">
            </el-table-column>
            <el-table-column prop="index" label="拥堵指数" width="auto">
            </el-table-column>
            <el-table-column prop="index_level" label="拥堵等级" width="auto">
            </el-table-column>
            <el-table-column prop="speed" label="时速" width="auto">
            </el-table-column>
            <el-table-column prop="yongdu_length" label="拥堵长度" width="auto">
            </el-table-column>
          </el-table>
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
      all_road_data: [],
      high_road_data: [],
      index_level: {
        1: "畅通",
        2: "缓行",
        3: "拥堵",
        4: "严重拥堵",
      },
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
        .get(url["traffic_index"], {
          params: {
            city: that.input_city,
          },
        })
        .then(function (response) {
          var data = response.data;
          // 全部道路拥堵情况
          var congest_allroad = data["全部道路拥堵情况"];
          // table数据赋值前清空数据
          that.all_road_data = [];
          for (let one of congest_allroad) {
            that.all_road_data.push({
              date: one["time"],
              speed: one["speed"],
              index_level: that.index_level[one["index_level"]],
              index: one["index"],
              name: one["roadname"],
              address: one["semantic"],
              yongdu_length: one["yongdu_length"],
            });
          }

          // 高速/快速路拥堵情况
          var congest_highroad = data["高速/快速路拥堵情况"];
          that.high_road_data = [];
          for (let one of congest_highroad) {
            that.high_road_data.push({
              date: one["time"],
              speed: one["speed"],
              index_level: that.index_level[one["index_level"]],
              index: one["index"],
              name: one["roadname"],
              address: one["semantic"],
              yongdu_length: one["yongdu_length"],
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};
</script>