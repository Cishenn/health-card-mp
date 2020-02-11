// pages/group/group-detail/group-detail.js
// import * as echarts from '/ec-canvas/echarts' 为什么写绝对路径报错
import * as echarts from '../../../ec-canvas/echarts';
import Dialog from '@vant/weapp/dialog/dialog';
import { getDate } from '../../../utils/util';
let that = null;
let pie1 = null;
let pie2 = null;

Page({
  data: {
    groupId: null,
    maintained: null,
    groupInfo: null,
    announcement: null,
    clockInData: null,
    healthData: null,
    positionData: null,
    clockInDetail: null,
    _chosenDate: 0,
    chosenDate: getDate(0),
    latestDate: getDate(0),
    firstDate: null,
    // chosenDate = getDate(addDayCount)
    displayedDate: null,
    // showDetail: false 显示数据统计，true 显示详细数据
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
    }
  },


  goToPost: function() {
    if (this.data.maintained) {
      wx.navigateTo({
        url: `/pages/post/post-management/post-management?id=${this.data.groupId}`
      });
    }
    else {
      wx.navigateTo({
        url: `/pages/post/post-detail/post-detail?id=${this.data.groupId}`
      });
    }
  },


  formatDate: function(chosenDate) {
    if (chosenDate.length !== 8) {
      console.log('formatDate() 参数格式错误');

      return '';
    }

    return `${chosenDate.substr(4, 2)}-${chosenDate.substr(6, 2)}`;
  },


  backward: function() {
    this.changeData(this.data._chosenDate - 1);
  },
  forward: function() {
    this.changeData(this.data._chosenDate + 1);
  },
  changeData: function(_chosenDate) {
    const chosenDate = getDate(_chosenDate);
    const displayedDate = this.formatDate(chosenDate);
    this.setData({
      _chosenDate,
      chosenDate,
      displayedDate,
      activeNames: []
    });
    this.getNormalData();
    if (this.data.maintained) {
      this.getManageData();
    }
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
    wx.request({
      url: `${getApp().globalData.apiUrl}group/report-excel/${this.data.groupId}?time/${this.data.chosenDate}`,
      success: res => {
        const download = `https://health-card.dataee.net/file/${res.data}`;
        let copied = false;
        let message = '';
        wx.setClipboardData({
          data: download,
          success: () => {
            copied = true;
          }
        });
        if (copied) {
          message = `文件下载地址：${download}。（网址已自动复制，请进入浏览器访问该网址进行下载。）`;
        }
        else {
          message = `文件下载地址：${download}。（网址自动复制失败，请手动复制后进入浏览器下载。）`;
        }
        Dialog.alert({
          message: message
        });
      }
    });
  },


  onLoad: function(options) {
    that = this;
    wx.setNavigationBarTitle({
      title: '小组详情'
    });
    const maintained = Boolean(Number(options.maintained));
    let groupInfo = null;
    let announcement = null;
    let firstDate = null;
    wx.request({
      url: `${getApp().globalData.apiUrl}group/${options.id}`,
      success: res => {
        groupInfo = res.data;
        firstDate = groupInfo.createdAt.split('T')[0].split('-').join('');
      },
      fail: err => {
        console.log(err);
      }
    });
    wx.request({
      url: `${getApp().globalData.apiUrl}group/${options.id}/announcement`,
      success: res => {
        announcement = res.data;
      },
      fail: err => {
        console.log(err);
      }
    });

    this.setData({
      groupId: options.id,
      maintained,
      groupInfo,
      announcement,
      firstDate,
      displayedDate: this.formatDate(getDate(0))
    });
    this.getNormalData();
    if (maintained) {
      this.getManageData();
    }
  },


  getNormalData: function() {
    let clockInData = null;
    let healthData = null;
    let positionData = null;

    wx.request({
      url: `${getApp().globalData.apiUrl}group/report-number-data/${this.data.groupId}?time=${this.chosenDate}`,
      success: res => {
        clockInData = res.data;
      },
      fail: err => {
        console.log(err);
      }
    });
    wx.request({
      url: `${getApp().globalData.apiUrl}group/report-health-data/${this.data.groupId}?time=${this.chosenDate}`,
      success: res => {
        healthData = res.data;
      },
      fail: err => {
        console.log(err);
      }
    });
    wx.request({
      url: `${getApp().globalData.apiUrl}group/report-distribute-data/${this.data.groupId}?time=${this.chosenDate}`,
      success: res => {
        positionData = res.data;
      },
      fail: err => {
        console.log(err);
      }
    });
    this.setData({
      clockInData,
      healthData,
      positionData
    });
  },


  getManageData: function() {
    wx.request({
      url: `${getApp().globalData.apiUrl}group/${this.data.groupId}/member/report?time=${this.chosenDate}`,
      success: res => {
        this.setData({
          clockInDetail: res.data
        });
      },
      fail: err => {
        console.log(err);
      }
    });
  }
});


const getPie1Option = function() {
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
        value: that.data.healthData.fine,
        name: '正常'
      }, {
        value: that.data.healthData.selfDange,
        name: '自查异常'
      }, {
        value: that.data.healthData.danger,
        name: '疑似'
      }, {
        value: that.data.healthData.ill,
        name: '确诊'
      }]
    }]
  };
};

const getPie2Option = function() {
  let data = null;
  if (that.data.groupInfo.type === '社区') {
    data = [{
      value: that.data.positionData.inWuHan,
      name: '武汉市内'
    }, {
      value: that.data.positionData.inHuBei,
      name: '湖北省内'
    }, {
      value: that.data.positionData.inCountry,
      name: '国内'
    }, {
      value: that.data.positionData.outCountry,
      name: '国外'
    }, {
      value: that.data.positionData.localCommunity,
      name: '本社区'
    }];
  }
  else if (that.data.groupInfo.type === '学校') {
    data = [{
      value: that.data.positionData.inWuHan,
      name: '武汉市内'
    }, {
      value: that.data.positionData.inHuBei,
      name: '湖北省内'
    }, {
      value: that.data.positionData.inCountry,
      name: '国内'
    }, {
      value: that.data.positionData.outCountry,
      name: '国外'
    }, {
      value: that.data.positionData.localSchool,
      name: '本学校'
    }];
  }
  else {
    data = [{
      value: that.data.positionData.inWuHan,
      name: '武汉市内'
    }, {
      value: that.data.positionData.inHuBei,
      name: '湖北省内'
    }, {
      value: that.data.positionData.inCountry,
      name: '国内'
    }, {
      value: that.data.positionData.outCountry,
      name: '国外'
    }];
  }

  return {
    series: [{
      label: {
        rich: {
          fontSize: 18
        }
      },
      type: 'pie',
      radius: '80%',
      data: data
    }]
  };
};