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
      <el-col :span="12">
        <el-card shadow="always" style="height: 500px">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            实时拥堵指数与拥堵里程
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <span style="margin-top: -30px">实时拥堵指数: </span>
          <p
            v-text="index"
            style="
              font-weight: bold;
              font-size: 30px;
              margin-top: 0px;
              margin-bottom: 5px;
            "
          ></p>
          <span style="margin-top: -30px; color: #92967d"
            >上周同期拥堵指数:
          </span>
          <span
            v-text="last_index"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <span style="margin-left: 50px" v-text="rateStr"></span>
          <br />
          <span style="margin-top: -30px; color: #92967d"
            >平均速度（km/h）:
          </span>
          <span
            v-text="road_network_speed"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <br />
          <span style="margin-top: -30px; color: #92967d">近30天最堵日: </span>
          <span
            v-text="max_congest_day"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <span style="margin-left: 10px" v-text="weekDay"></span>
          <br />
          <span style="margin-top: -30px; color: #92967d"
            >近30天最堵日高峰拥堵指数:
          </span>
          <span
            v-text="max_index"
            style="font-size: 20px; margin-top: 0px; margin-bottom: 5px"
          ></span>
          <div id="Congestion_index" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always" style="height: 500px">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            实时拥堵里程
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <div id="index_now" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="always" style="height: 500px">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            当日24小时拥堵指数变化
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <div
            id="Congest_index_change"
            style="width: 100%; height: 400px"
          ></div>
        </el-card>
      </el-col>
      <el-col :span="24">
        <el-card shadow="always" style="height: 500px">
          <h2
            style="margin-top: -10px; text-align: center; margin-bottom: -15px"
          >
            当日24小时时速变化
          </h2>
          <el-divider
            style="margin-top: -30px; margin-bottom: -20px"
          ></el-divider>
          <div id="speed_change" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { url } from "../apis/urls";
import axios from "axios";
import echarts from "echarts";
import { publicMethod } from "../utils.js";

export default {
  data() {
    return {
      input_city: "镇江",
      // 实时拥堵指数内容參數
      index: "",
      last_index: "",
      max_congest_day: "",
      max_index: "",
      max_week_day: "",
      road_network_speed: "",
      week_rate: "",
      rateStr: "",
      math2Zh: {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "日",
      },
      weekDay: "",
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
          // 实时拥堵指数内容
          var congest_index_now = data["实时拥堵指数内容"];
          that.index = congest_index_now["index"];
          that.last_index = congest_index_now["last_index"];
          that.max_congest_day = congest_index_now["max_congest_day"];
          that.max_index = congest_index_now["max_index"];
          that.max_week_day = congest_index_now["max_week_day"];
          that.weekDay = "星期" + that.math2Zh[that.max_week_day];
          that.road_network_speed = congest_index_now["road_network_speed"];
          that.week_rate = congest_index_now["week_rate"];
          if (parseFloat(that.week_rate) > 0) {
            that.rateStr =
              "较上周同期上升" + (that.week_rate * 100).toFixed(2) + "%";
          } else if (parseFloat(that.week_rate) < 0) {
            that.rateStr =
              "较上周同期下降" + -(that.week_rate * 100).toFixed(2) + "%";
          } else {
            that.rateStr = "较上周同期一致";
          }
          that.drawIndex(that.index);

          // 实时拥堵指数变化
          var congest_index_change = data["实时拥堵指数变化"];
          that.drawCongestIndexChange(congest_index_change);

          // 实时道路拥堵指数
          // var congest_road_index_now = data["实时道路拥堵指数"]
          // console.log(congest_road_index_now)

          // 实时拥堵里程
          var congest_mile_now = data["实时拥堵里程"];
          that.drawIndexNow(congest_mile_now);

          // 昨日早晚高峰
          // var congest_peak = data['昨日早晚高峰']
          // console.log(congest_peak)

          // 全部道路拥堵情况
          // var congest_allroad = data['全部道路拥堵情况']
          // console.log(congest_allroad)

          // 高速/快速路拥堵情况
          // var congest_highroad = data['高速/快速路拥堵情况']
          // console.log(congest_highroad)
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    drawIndex: function (indexValue) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("Congestion_index"));
      var option = {
        series: [
          {
            type: "gauge",
            radius: "75%",
            startAngle: 180,
            endAngle: 0,
            min: 1,
            max: 3,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, "#7CFFB2"],
                  [0.5, "#58D9F9"],
                  [0.75, "#FDDD60"],
                  [1, "#FF6E76"],
                ],
              },
            },
            pointer: {
              icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
              length: "90%",
              width: 10,
              offsetCenter: [0, "-60%"],
              itemStyle: {
                color: "auto",
              },
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: "auto",
                width: 2,
              },
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: "auto",
                width: 5,
              },
            },
            axisLabel: {
              color: "#464646",
              fontSize: 20,
              distance: -60,
              formatter: function (value) {
                if (value === 2.75) {
                  return "差";
                } else if (value === 2.25) {
                  return "良";
                } else if (value === 1.75) {
                  return "中";
                } else if (value === 1.25) {
                  return "优";
                }
              },
            },
            title: {
              offsetCenter: [0, "-45%"],
              fontSize: 20,
            },
            detail: {
              fontSize: 30,
              offsetCenter: [0, "-25%"],
              valueAnimation: true,
              formatter: function (value) {
                return value;
              },
              color: "auto",
            },
            data: [
              {
                value: indexValue,
                name: "拥堵指数",
              },
            ],
          },
        ],
      };
      myChart.clear();
      myChart.setOption(option);
    },
    drawIndexNow: function (chartsData) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("index_now"));
      var now_data = [
        chartsData["serious"],
        chartsData["congest"],
        chartsData["slowly"],
      ];
      var avg_data = [
        chartsData["avg_serious"],
        chartsData["avg_congest"],
        chartsData["avg_slowly"],
      ];
      var rate_data = [
        chartsData["serious_rate"],
        chartsData["congest_rate"],
        chartsData["slowly_rate"],
      ];
      var labelOption = {
        formatter: "{c}  {name|{a}}",
        fontSize: 16,
        rich: {
          name: {},
        },
      };
      var option = {
        title: {
          text: "congestion mileage",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter(params) {
            return (
              params[0].axisValueLabel +
              "<br>" +
              params[0].seriesName +
              ":" +
              params[0].value +
              "<br>" +
              params[1].seriesName +
              ":" +
              params[1].value +
              "<br>" +
              "较节假日均值:" +
              (rate_data[params[0].dataIndex] * 100).toFixed(2) +
              "%"
            );
          },
        },
        legend: {
          data: ["当前值", "节假日均值"],
        },
        toolbox: {
          show: true,
          orient: "vertical",
          left: "right",
          top: "center",
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack", "tiled"] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            axisTick: { show: false },
            data: ["严重拥堵", "拥堵", "缓行"],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "km",
          },
        ],
        series: [
          {
            name: "当前值",
            type: "bar",
            barGap: 0,
            label: labelOption,
            emphasis: {
              focus: "series",
            },
            data: now_data,
          },
          {
            name: "节假日均值",
            type: "bar",
            label: labelOption,
            color: "#f7c5a8",
            emphasis: {
              focus: "series",
            },
            data: avg_data,
          },
        ],
      };
      myChart.clear();
      myChart.setOption(option);
    },
    drawCongestIndexChange: function (chartsData) {
      // 基于准备好的dom，初始化echarts实例
      var myChart_index = echarts.init(
        document.getElementById("Congest_index_change")
      );
      var myChart_speed = echarts.init(document.getElementById("speed_change"));
      var index_change_data = [];
      var speed_change_data = [];

      var today = publicMethod.getdate();

      // 计算0点到现在打了多少点， 用于纠正数据
      var date = new Date();
      var ts_now = date.getTime();
      var yesterday = publicMethod.timestampToTime(
        ts_now - 1000 * 24 * 60 * 60
      );
      var ts_yesterday =
        Date.parse(yesterday) - 8 * 60 * 60 * 1000 + 1000 * 24 * 60 * 60;
      // var ts_yesterday = Date.parse(yesterday) + 1000 * 24 * 60 * 60;
      var times = ((ts_now - ts_yesterday) / 1000 / (5 * 60)).toFixed(0);
      var index = 0;

      for (let one of chartsData) {
        var datetime = "";
        // 数据纠正
        if (index <= chartsData.length - times) {
          datetime = yesterday + " " + one["time"] + ":" + "00";
        } else {
          datetime = today + " " + one["time"] + ":" + "00";
        }

        index_change_data.push([datetime, one["index"]]);
        speed_change_data.push([datetime, one["speed"]]);
        index++;
      }

      // 拥堵指数变化图
      var index_option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "Congestion index changes",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
        },
        series: [
          {
            name: "拥堵指数",
            type: "line",
            smooth: true,
            symbol: "none",
            areaStyle: {
              color: "#caf7e3",
            },
            data: index_change_data,
          },
        ],
      };
      myChart_index.clear();
      myChart_index.setOption(index_option);

      // 时速变化图
      var speed_option = {
        tooltip: {
          trigger: "axis",
          position: function (pt) {
            return [pt[0], "10%"];
          },
        },
        title: {
          left: "center",
          text: "average speed changes",
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none",
            },
            restore: {},
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "time",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
          name: "km/h",
          boundaryGap: [0, "100%"],
        },
        series: [
          {
            name: "平均时速",
            type: "line",
            smooth: true,
            symbol: "none",
            color: "#f0c929",
            areaStyle: {
              color: "#95e1d3",
            },
            data: speed_change_data,
          },
        ],
      };
      myChart_speed.clear();
      myChart_speed.setOption(speed_option);
    },
  },
};
</script>