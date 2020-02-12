// pages/group/group-detail/group-detail.js

import * as echarts from '../../../ec-canvas/echarts';
import Dialog from '@vant/weapp/dialog/dialog';
import { getDate, formatDate, getDisplayDate } from '../../../utils/util.js';
import { getPie1Option, getPie2Option } from '../../../utils/charts.js';
import { exportData, getGroupDetail, getAnnouncement,
  getClockInData, getHealthData, getDistributeData, getClockInDetail
} from '../../../api/service/group.js';

let pie1 = null;
let pie2 = null;

Page({
  data: {
    groupId: null,
    managed: null,
    groupInfo: null,
    announcement: null,
    clockInData: null,
    healthData: null,
    distributeData: null,
    clockInDetail: null,
    _chosenDate: 0,
    // chosenDate = getDate(_chosenDate)
    chosenDate: getDate(0),
    latestDate: getDate(0),
    firstDate: null,
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
    if (this.data.managed) {
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
    if (this.data.managed) {
      this.getManageData();
    }
    pie1.setOption(getPie1Option(this.data.healthData));
    pie2.setOption(getPie2Option(this.data.groupInfo.type, this.data.distributeData));
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
    exportData(this.data.groupId, this.chosenDate).then(res => {
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
    }).catch(err => {
      console.error(err);
    });
  },


  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '小组详情'
    });
    const managed = Boolean(Number(options.managed));
    const groupId = options.id;
    let groupInfo = null;
    let announcement = null;
    let firstDate = null;
    getGroupDetail(groupId).then(res => {
      groupInfo = res.data;
      firstDate = formatDate(groupInfo.createdAt);
    }).catch(err => {
      console.error(err);
    });
    getAnnouncement(groupId).then(res => {
      announcement = res.data;
    }).catch(err => {
      console.error(err);
    });
    this.setData({
      groupId,
      managed,
      groupInfo,
      announcement,
      firstDate,
      displayedDate: getDisplayDate(getDate(0))
    });
    this.getNormalData();
    if (managed) {
      this.getManageData();
    }
  },


  // 普通用户能看到的数据
  getNormalData: function() {
    const groupId = this.data.groupId;
    const date = this.data.chosenDate;
    let clockInData = null;
    let healthData = null;
    let distributeData = null;
    getClockInData(groupId, date).then(res => {
      clockInData = res.data;
    }).catch(err => {
      console.error(err);
    });
    getHealthData(groupId, date).then(res => {
      healthData = res.data;
    }).catch(err => {
      console.error(err);
    });
    getDistributeData(groupId, date).then(res => {
      distributeData = res.data;
    }).catch(err => {
      console.error(err);
    });
    this.setData({
      clockInData,
      healthData,
      distributeData
    });
  },

  // 管理员能看到的数据
  getManageData: function() {
    getClockInDetail(this.data.groupId, this.chosenDate).then(res => {
      this.setData({
        clockInDetail: res.data
      });
    }).catch(err => {
      console.error(err);
    });
  }
});