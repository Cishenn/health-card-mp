// pages/group/group-detail/group-detail.js
// import * as echarts from '/ec-canvas/echarts' 为什么写绝对路径报错
import * as echarts from '../../../ec-canvas/echarts';
let that = null;
let pie1 = null;
let pie2 = null;

Page({
  data: {
    // maintained 是否为管理员，在 onLoad 获取
    // statisticalData、detailedData 的数组下标
    chosenData: 0,
    // false 显示数据统计，true 显示详细数据
    showDetail: false,
    activeNames: [],
    ec1: {
      onInit: function(canvas, width, height) {
        pie1 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(pie1);
        pie1.setOption(getPie1Option());

        return pie1;
      }
    },
    ec2: {
      onInit: function(canvas, width, height) {
        pie2 = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(pie2);
        pie2.setOption(getPie2Option());

        return pie2;
      }
    },
    groupInfo: {
      id: 1,
      type: 'school',
      name: '兰州大学计算机学院一班',
      digest: '兰州大学计算机学院学生疫情期间打卡群',
      post: '请大家于明天中午12点之前在XXX地点统一领取免费口罩。',
      // post: '',
      maintainer: {
        name: '小明',
        phone: '13766668888',
      },
      statisticalData: [
        {
          date: '02-06',
          normal: 1,
          abnormal: 1,
          suspected: 1,
          confirmed: 1,
          domestic: 2,
          home: 1,
          abroad: 1,
          total: 4,
          checked: 3,
          unchecked: 1
        },
        {
          date: '02-05',
          normal: 4,
          abnormal: 0,
          suspected: 0,
          confirmed: 0,
          domestic: 4,
          home: 0,
          abroad: 0,
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
          domestic: 2,
          home: 1,
          abroad: 1,
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
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-06',
            id: 2,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-06',
            id: 3,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          }
        ],
        [
          {
            date: '02-05',
            id: 1,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-05',
            id: 2,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-05',
            id: 3,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          }
        ],
        [
          {
            date: '02-04',
            id: 1,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-04',
            id: 2,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          },
          {
            date: '02-04',
            id: 3,
            name: '小红',
            phone: '13766668888',
            position: '武汉市内',
            status: '正常'
          }
        ]
      ]
    }
  },

  goToPost: function() {
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
    // const query = wx.createSelectorQuery();
    // query.select('#pie1').setOption(getPie1Option());
    // query.select('#pie2').setOption(getPie2Option());
    pie1.setOption(getPie1Option());
    pie2.setOption(getPie2Option());
  },
  forward: function() {
    const chosenData = this.data.chosenData - 1;
    this.setData({
      chosenData
    });
    // const query = wx.createSelectorQuery();
    // query.select('#pie1').setOption(getPie1Option());
    // query.select('#pie2').setOption(getPie2Option());
    pie1.setOption(getPie1Option());
    pie2.setOption(getPie2Option());
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

  onLoad: function(options) {
    that = this;
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
  },
});

const getPie1Option = function() {
  const chosenData = that.data.chosenData;

  return {
    series: [{
      label: {
        rich: {
          fontSize: 18
        }
      },
      type: 'pie',
      radius: '80%',
      data: [{
        value: that.data.groupInfo.statisticalData[chosenData].normal,
        name: '正常'
      }, {
        value: that.data.groupInfo.statisticalData[chosenData].abnormal,
        name: '自查异常'
      }, {
        value: that.data.groupInfo.statisticalData[chosenData].suspected,
        name: '疑似'
      }, {
        value: that.data.groupInfo.statisticalData[chosenData].confirmed,
        name: '确诊'
      }]
    }]
  };
};

const getPie2Option = function() {
  const chosenData = that.data.chosenData;

  return {
    series: [{
      label: {
        rich: {
          fontSize: 18
        }
      },
      type: 'pie',
      radius: '80%',
      data: [{
        value: that.data.groupInfo.statisticalData[chosenData].home,
        name: '家中'
      }, {
        value: that.data.groupInfo.statisticalData[chosenData].domestic,
        name: '国内'
      }, {
        value: that.data.groupInfo.statisticalData[chosenData].abroad,
        name: '国外'
      }]
    }]
  };
};