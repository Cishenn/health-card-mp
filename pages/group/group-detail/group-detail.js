/* eslint-disable object-property-newline */
// pages/group/group-detail/group-detail.js

import F2 from '../../../f2-canvas/lib/f2-all.min.js';
import { getPie1Data, getPie2Data } from '../../../utils/charts';
import Dialog from '@vant/weapp/dialog/dialog';
import { exportData, getGroupDetail, getAnnouncement,
  getClockInData, getHealthData, getDistributeData, getClockInDetail
} from '../../../api/service/group.js';
import dayjs from 'dayjs';

let pie1 = null;
let pie2 = null;

Page({
  data: {
    showClockin: true,
    groupId: null,
    managed: null,
    groupInfo: null,
    announcement: null,
    clockInData: null,
    healthData: null,
    distributeData: null,
    clockInDetail: [],
    _chosenDate: 0,
    // chosenDate = getDate(_chosenDate)
    chosenDate: dayjs().format('YYYYMMDD'),
    latestDate: dayjs().format('YYYYMMDD'),
    firstDate: null,
    displayedDate: dayjs().format('YYYY-MM-DD'),
    chartsInited: false,
    // showDetail: false 显示数据统计，true 显示详细数据
    showDetail: false,
    dialogOnShow: false,
    activeNames: [],
    opts1: { lazyLoad: true },
    opts2: { lazyLoad: true },
    // total 包括亲戚
    total: 0,
  },

  switchModule: function() {
    const showClockin = !this.data.showClockin;
    this.setData({
      showClockin
    });
  },

  goToUnchecked: function() {
    wx.navigateTo({
      url: `/pages/group/unchecked-list/unchecked-list?` +
      `id=${this.data.groupId}&date=${this.data.chosenDate}&name=${this.data.groupInfo.name}`,
    });
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
    const displayedDate = dayjs().add(_chosenDate, 'day').format('YYYY-MM-DD');
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
    if (showDetail === false && this.data.chartsInited === false && this.data.clockInData.already !== 0) {
      this.initCharts();
    }
  },


  onChange: function(event) {
    this.setData({
      activeNames: event.detail
    });
  },


  exportData: function() {
    this.setData({ dialogOnShow: true });
    exportData(this.data.groupId, this.data.chosenDate).then(res => {
      if (res.data.code === -1) {
        Dialog.alert({
          message: '抱歉，数据文件尚未准备好'
        }).then(() => {
          this.setData({ dialogOnShow: false });
        });
      }
      else {
        const download = `https://health-card.dataee.net/file/${res.data}`;
        let message = '';
        // 注意 setClipboardData 是异步的
        wx.setClipboardData({
          data: download,
          success: () => {
            message = `文件下载地址：${download}。（网址已自动复制，请进入浏览器访问该网址进行下载。）`;
          },
          fail: () => {
            message = `文件下载地址：${download}。（网址自动复制失败，请手动复制后进入浏览器下载。）`;
          },
          complete: () => {
            Dialog.alert({
              message: message
            }).then(() => {
              this.setData({ dialogOnShow: false });
            });
          }
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
      // managed: Boolean(Number(options.managed))
    });
  },

  onShow: function() {
    const groupId = this.data.groupId;
    Promise.all([
      getGroupDetail(groupId),
      getAnnouncement(groupId),
    ]).then(res => {
      const groupInfo = res[0].data;
      const managed =
          groupInfo.managerId === getApp().globalData.userId ? true : false;
      const announcement =
          res[1].data.length === 0 ? null : res[1].data[0];
      this.setData({
        groupId,
        managed,
        groupInfo,
        announcement,
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


  // 普通用户能看到的数据
  getNormalData: function() {
    const groupId = this.data.groupId;
    const date = this.data.chosenDate;
    Promise.all([
      getClockInData(groupId, date),
      getHealthData(groupId, date),
      getDistributeData(groupId, date)
    ]).then(res => {
      let total = 0;
      const clockInData = res[0].data;
      let healthData = res[1].data;
      for (const key in healthData) {
        total += healthData[key];
      }
      healthData = getPie1Data(healthData, total);
      const distributeData = getPie2Data(this.data.groupInfo.type, res[2].data, total);
      this.setData({
        clockInData,
        healthData,
        distributeData,
        total,
      });
      if (!this.data.chartsInited && this.data.clockInData.already !== 0 && this.data.showDetail === false) {
        this.initCharts();
      }
      else if (this.data.chartsInited && this.data.clockInData.already !== 0) {
        this.updateCharts();
      }
    }).catch(err => {
      console.error(err);
    });
  },

  // 管理员能看到的数据
  getManageData: function() {
    getClockInDetail(this.data.groupId, this.data.chosenDate).then(res => {
      const clockInDetail = res.data;
      clockInDetail.map(item => (item.formatedTime = dayjs(item.reports[0].createdAt).format('MM-DD HH:mm')));
      clockInDetail.forEach(item => {
        item.reports[0].formatedSymptom = this.formatSymptom(item.reports[0].symptoms);
        item.reports[0].members.forEach(rela => {
          rela.formatedSymptom = this.formatSymptom(rela.symptoms);
        });
      });
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

  initCharts: function() {
    const canvas1 = this.selectComponent('#pie1');
    canvas1.init(this.initChart1);
    const canvas2 = this.selectComponent('#pie2');
    canvas2.init(this.initChart2);
  },

  updateCharts: function() {
    pie1.changeData(this.data.healthData);
    pie2.changeData(this.data.distributeData);
  },

  initChart1: function(canvas, width, height) {
    pie1 = new F2.Chart({
      el: canvas,
      width,
      height
    });
    const data = this.data.healthData;
    pie1.source(data);
    pie1.coord('polar', {
      transposed: true,
      radius: 0.75
    });
    pie1.legend(false);
    pie1.axis(false);
    pie1.tooltip(false);
    pie1.pieLabel({
      sidePadding: 16,
      label1: function label1(data, color) {
        return {
          text: data.name,
          fill: color
        };
      },
      label2: function label2(data) {
        return {
          text: `${data.value}人 (${data.percent})`,
          fill: '#808080',
          fontWeight: 'bold'
        };
      }
    });

    pie1.interval()
      .position('const*value')
      .color('name', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864' ])
      .adjust('stack');
    pie1.render();

    return pie1;
  },

  initChart2: function(canvas, width, height) {
    pie2 = new F2.Chart({
      el: canvas,
      width,
      height
    });
    const data = this.data.distributeData;
    pie2.source(data);
    pie2.coord('polar', {
      transposed: true,
      radius: 0.75
    });
    pie2.legend(false);
    pie2.axis(false);
    pie2.tooltip(false);
    pie2.pieLabel({
      sidePadding: 16,
      label1: function label1(data, color) {
        return {
          text: data.name,
          fill: color
        };
      },
      label2: function label2(data) {
        return {
          text: `${data.value}人 (${data.percent})`,
          fill: '#808080',
          fontWeight: 'bold'
        };
      }
    });

    pie2.interval()
      .position('const*value')
      .color('name', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864' ])
      .adjust('stack');
    pie2.render();

    return pie2;
  },

  formatSymptom: function(symptoms) {
    if (symptoms.length === 0) {
      return '';
    }
    let formatedSymptom = '';
    symptoms.forEach(item => {
      formatedSymptom += `${item.detail}，`;
    });

    return formatedSymptom.substring(0, formatedSymptom.length - 1);
  }
});
