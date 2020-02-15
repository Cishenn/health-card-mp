// pages/group/group-detail/group-detail.js

import * as echarts from '../../../ec-canvas/echarts';
import Dialog from '@vant/weapp/dialog/dialog';
import { getPie1Option, getPie2Option } from '../../../utils/charts.js';
import { exportData, getGroupDetail, getAnnouncement,
  getClockInData, getHealthData, getDistributeData, getClockInDetail
} from '../../../api/service/group.js';
import dayjs from 'dayjs';

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
    chosenDate: dayjs().format('YYYYMMDD'),
    latestDate: dayjs().format('YYYYMMDD'),
    firstDate: null,
    displayedDate: dayjs().format('MM-DD'),
    chartsInited: false,
    // showDetail: false 显示数据统计，true 显示详细数据
    showDetail: false,
    activeNames: []
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
    const chosenDate = dayjs().add(_chosenDate, 'day').format('YYYYMMDD');
    const displayedDate = dayjs().add(_chosenDate, 'day').format('MM-DD');
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
    exportData(this.data.groupId, this.data.chosenDate).then(res => {
      if (res.data.code === -1) {
        Dialog.alert({
          message: '抱歉，数据文件尚未准备好'
        });
      }
      else {
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
    }).catch(err => {
      console.error(err);
    });
  },


  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '小组详情'
    });
    this.setData({
      groupId: options.id,
      managed: Boolean(Number(options.managed))
    });
  },

  onShow: function() {
    const groupId = this.data.groupId;
    const managed = this.data.managed;
    Promise.all([
      getGroupDetail(groupId),
      getAnnouncement(groupId),
    ]).then(res => {
      this.setData({
        groupId,
        managed,
        groupInfo: res[0].data,
        announcement: res[1].data,
        firstDate: dayjs(res[0].data.createdAt).format('YYYYMMDD')
      });
      this.getNormalData();
      if (managed) {
        this.getManageData();
      }
    }).catch(err => {
      console.error(err);
    });
  },


  initCharts: function() {
    const ec1 = this.selectComponent('#pie1');
    ec1.init((canvas, width, height) => {
      pie1 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(pie1);
      pie1.setOption(getPie1Option(this.data.healthData));

      return pie1;
    });
    const ec2 = this.selectComponent('#pie2');
    ec2.init((canvas, width, height) => {
      pie2 = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      canvas.setChart(pie2);
      pie2.setOption(getPie2Option(this.data.groupInfo.type, this.data.distributeData));

      return pie2;
    });
    this.setData({
      chartsInited: true
    });
  },


  // 普通用户能看到的数据
  getNormalData: function() {
    const groupId = this.data.groupId;
    const date = this.data.chosenDate;
    Promise.all([
      getClockInData(groupId, date),
      getHealthData(groupId, date),
      getDistributeData(groupId, date)
    ]).then(res => {
      this.setData({
        clockInData: res[0].data,
        healthData: res[1].data,
        distributeData: res[2].data
      });
      if (!this.data.chartsInited) {
        this.initCharts();
      }
      else {
        pie1.setOption(getPie1Option(this.data.healthData));
        pie2.setOption(getPie2Option(this.data.groupInfo.type, this.data.distributeData));
      }
    }).catch(err => {
      console.error(err);
    });
  },

  // 管理员能看到的数据
  getManageData: function() {
    getClockInDetail(this.data.groupId, this.data.chosenDate).then(res => {
      const clockInDetail = res.data;
      clockInDetail.map(item => (item.formatedTime = dayjs(item.createdAt).format('MM-DD HH:mm')));
      this.setData({
        clockInDetail
      });
    }).catch(err => {
      console.error(err);
    });
  },

  onPullDownRefresh: function() {
    this.onShow();
    wx.stopPullDownRefresh();
  },
});
