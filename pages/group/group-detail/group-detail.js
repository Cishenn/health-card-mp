// pages/group/group-detail/group-detail.js
// import * as echarts from '/ec-canvas/echarts' 为什么写绝对路径报错
import * as echarts from '../../../ec-canvas/echarts';

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);

  const option = {
    series: [{
      name: '销量',
      type: 'pie',
      data: [
        { name: '正常',
          value: 1 },
        { name: '自查异常',
          value: 1 },
        { name: '疑似',
          value: 1 },
        { name: '确诊',
          value: 1 }
      ]
    }]
  };
  chart.setOption(option);

  return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // maintained 是否为管理员，在 onLoad 获取
    // statisticalData、detailedData 的数组下标
    chosenData: 0,
    // false 显示数据统计，true 显示详细数据
    showDetail: false,
    activeNames: [],
    ec: {
      onInit: initChart
    },
    groupInfo: {
      id: 1,
      type: 'school',
      name: '兰州大学计算机学院一班',
      digest: '兰州大学计算机学院学生疫情期间打卡群',
      // post: '请大家于明天中午12点之前在XXX地点统一领取免费口罩。',
      post: '',
      maintainer: {
        name: '小明',
        phone: 13766668888,
      },
      statisticalData: [
        {
          date: '02-06',
          normal: 1,
          abnormal: 1,
          suspected: 1,
          confirmed: 1,
          total: 4,
          checked: 3,
          unchecked: 1
        },
        {
          date: '02-05',
          normal: 1,
          abnormal: 1,
          suspected: 1,
          confirmed: 1,
          total: 4,
          checked: 3,
          unchecked: 1
        },
        {
          date: '02-04',
          normal: 1,
          abnormal: 1,
          suspected: 1,
          confirmed: 1,
          total: 4,
          checked: 3,
          unchecked: 1
        }
      ],
      detailedData: [
        [
          {
            date: '02-06',
            id: 1,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-06',
            id: 2,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-06',
            id: 3,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          }
        ],
        [
          {
            date: '02-05',
            id: 1,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-05',
            id: 2,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-05',
            id: 3,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          }
        ],
        [
          {
            date: '02-04',
            id: 1,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-04',
            id: 2,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-04',
            id: 3,
            name: '小红',
            phone: 13766668888,
            position: '武汉市内',
            status: '正常'
          }
        ]
      ]
    }
  },

  goToPost: function() {
    console.log(this.data.maintained);
    if (this.data.maintained) {
      wx.navigateTo({
        url: `/pages/post/post-management/post-management?id=${this.data.groupInfo.id}`
      });
    }
    else {
      wx.navigateTo({
        url: `/pages/post/post-detail/post-detail?id=${this.data.groupInfo.id}`
      });
    }
  },

  backward: function() {
    const chosenData = this.data.chosenData + 1;
    this.setData({
      chosenData
    });
  },
  forward: function() {
    const chosenData = this.data.chosenData - 1;
    this.setData({
      chosenData
    });
  },

  switchDataTab: function() {
    const showDetail = !this.data.showDetail;
    this.setData({
      showDetail
    });
  },

  onChange: function(event) {
    this.setData({
      activeNames: event.detail
    });
  },

  exportData: function() {
    // TODO:
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '小组详情'
    });
    const maintained = Boolean(Number(options.maintained));
    this.setData({
      maintained
    });
    // eslint-disable-next-line no-unused-vars
    const id = Number(options.id);
    // TODO: 由id获取groupInfo
  }
});