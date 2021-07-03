<template>
  <div>
    <el-input
      placeholder="请输入城市"
      prefix-icon="el-icon-search"
      v-model="input_city"
      style="width: 200px; margin-right: 20px"
    ></el-input>
    <el-button type="primary" @click="handleClick">查询</el-button>
    <el-button
      type="primary"
      @click="handleMine"
      style="align-left: 20px"
      v-show="isShow"
      >一键挖掘数据</el-button
    >
    <br />
    <br />
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="always" style="height: auto">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            公交线路网详情查询
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <el-input
            v-model="line_num"
            suffix-icon="el-icon-search"
            style="width: 300px; margin-buttom: -10px"
            placeholder="搜索公交线路（例如：19）..."
          />
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <el-table
            :data="showIntoTable"
            stripe
            cell-style="font-weight: 700;"
            header-cell-style="color:#232323"
            style="width: 100%; font-size: 15px; color: #232323"
          >
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="公交线路" style="font-weight:bold">
                    <strong>{{ props.row.route_detail }}</strong>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="city" label="城市" width="50px">
            </el-table-column>
            <el-table-column prop="bus_name" label="公交线路" width="260px">
            </el-table-column>
            <el-table-column prop="bus_type" label="公交类型" width="150px">
            </el-table-column>
            <el-table-column prop="bus_runtime" label="运行时间" width="450px">
            </el-table-column>
            <el-table-column prop="bus_price" label="票价" width="300px">
            </el-table-column>
            <el-table-column prop="bus_company" label="所属公司" width="200px">
            </el-table-column>
            <el-table-column
              prop="bus_update"
              label="更新时间"
              width="150px"
              fixed="right"
            >
            </el-table-column>
          </el-table>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 50, 100, 500, 1000]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="color: black; float: right"
          >
          </el-pagination>
          <br />
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
      table_data: [],
      showIntoTable: [],
      total: 0,
      pageSizes: 10,
      offset: 1,
      line_num: "",
      isShow: false,
    };
  },
  watch: {
    line_num() {
      let newData = [];
      if (this.line_num !== "") {
        this.table_data.filter((data) => {
          if (String(data.bus_name).includes(this.line_num)) {
            newData.push(data);
          }
        });
        // 分页显示处理
        this.total = newData.length;
        let start = (this.offset - 1) * this.pageSizes;
        this.showIntoTable = newData.slice(start, start + this.pageSizes);
      } else {
        // 为空则显示所有
        this.total = this.table_data.length;
        let start = (this.offset - 1) * this.pageSizes;
        this.showIntoTable = this.table_data.slice(
          start,
          start + this.pageSizes
        );
      }
    },
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
        .get(url["bus_net_detail_search"], {
          params: {
            city: that.input_city,
          },
        })
        .then(function (response) {
          var data = response.data.data;
          if (data.length === 0) {
            alert("数据库暂时没有该城市数据,请先挖掘数据...");
            that.isShow = true;
          }
          // 提取表格数据
          that.table_data = [];
          for (let one of data) {
            that.table_data.push({
              bus_name: one["bus_name"],
              bus_type: one["bus_type"],
              bus_runtime: one["bus_runtime"].split("：")[1],
              bus_price: one["bus_price"].split("：")[1],
              bus_company: one["bus_company"].split("：")[1],
              bus_update: one["bus_update"].split("：")[1],
              route_detail: one["route_detail"],
              city: one["city"],
            });
          }
          // 分页显示
          that.total = that.table_data.length;
          that.handeleDataShowIntoTable();
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleMine() {
      var that = this;
      axios
        .get(url["bus_net_detail"], {
          params: {
            city: that.input_city,
          },
        })
        .then(function () {
          alert("数据挖掘中，请稍后查看.....");
          that.isShow = false;
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.offset = val;
      this.handeleDataShowIntoTable();
    },
    handleSizeChange(limit) {
      this.pageSizes = limit;
      this.handeleDataShowIntoTable();
    },
    handeleDataShowIntoTable() {
      let start = (this.offset - 1) * this.pageSizes;
      this.showIntoTable = this.table_data.slice(start, start + this.pageSizes);
    },
  },
};
</script>