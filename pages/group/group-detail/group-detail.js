/* eslint-disable object-property-newline */
// pages/group/group-detail/group-detail.js

import F2 from '../../../f2-canvas/lib/f2-all.min.js';
import { getPie1Data, getPie2Data, getPie3Data } from '../../../utils/charts';
import Dialog from '@vant/weapp/dialog/dialog';
import { exportData, getGroupDetail, getAnnouncement,
  getClockInData, getHealthData, getDistributeData, getClockInDetail
} from '../../../api/service/group.js';
import { getContactData } from '../../../api/service/report';
import dayjs from 'dayjs';
import { convertCodeToStringArray } from '../../../common/js/area';

let pie1 = null;
let pie2 = null;
let pie3 = null;

Page({
  data: {
    showClockIn: false,
    hasSubmit: false,
    groupId: null,
    managed: null,
    groupInfo: null,
    announcement: null,
    clockInData: null,
    healthData: null,
    distributeData: null,
    contactData: null,
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
    opts3: { lazyLoad: true },
    // total 包括亲戚
    total: 0,
  },

  switchModule: function() {
    const showClockIn = !this.data.showClockIn;
    this.setData({
      showClockIn
    });
    if (!this.data.showDetail && !this.data.chartsInited &&
        !showClockIn && this.data.clockInData.already) {
      this.initCharts();
    }
    else if (!this.data.showDetail && this.data.chartsInited &&
      !showClockIn && this.data.clockInData.already) {
      this.updateCharts();
    }
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
    if (!showDetail && !this.data.chartsInited && this.data.clockInData.already) {
      this.initCharts();
    }
    else if (!showDetail && this.data.chartsInited && this.data.clockInData.already) {
      this.updateCharts();
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
      hasSubmit: options.hasSubmit,
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

  // 打卡组件打卡事件监听
  onClockIn: function() {
    this.setData({
      hasSubmit: true,
    });
    this.onShow();
  },

  // 普通用户能看到的数据
  getNormalData: function() {
    const groupId = this.data.groupId;
    const date = this.data.chosenDate;
    Promise.all([
      getClockInData(groupId, date),
      getHealthData(groupId, date),
      getDistributeData(groupId, date),
      getContactData(groupId, date),
    ]).then(res => {
      let total = 0;
      const clockInData = res[0].data;
      let healthData = res[1].data;
      for (const key in healthData) {
        total += healthData[key];
      }
      healthData = getPie1Data(healthData, total);
      const distributeData = getPie2Data(this.data.groupInfo.type, res[2].data, total);
      const contactData = getPie3Data(res[3].data, total);
      this.setData({
        clockInData,
        healthData,
        distributeData,
        contactData,
        total,
      });
      if (!this.data.chartsInited && this.data.clockInData.already &&
          !this.data.showDetail && !this.data.showClockIn) {
        this.initCharts();
      }
      else if (this.data.chartsInited && this.data.clockInData.already &&
          !this.data.showDetail && !this.data.showClockIn) {
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
      clockInDetail.forEach(item => {
        item.formatedTime = dayjs(item.reports[0].createdAt).format('MM-DD HH:mm');
        item.reports[0].location = convertCodeToStringArray(item.reports[0].location);
        item.reports[0].symptoms = this.formatSymptom(item.reports[0].symptoms);
        item.reports[0].touch = item.reports[0].contact ? '是' : '否';
        item.reports[0].members.forEach(relative => {
          relative.location = convertCodeToStringArray(relative.location);
          relative.symptoms = this.formatSymptom(relative.symptoms);
          relative.touch = relative.contact ? '是' : '否';
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
    canvas1.init(this.initChart, 1);
    const canvas2 = this.selectComponent('#pie2');
    canvas2.init(this.initChart, 2);
    const canvas3 = this.selectComponent('#pie3');
    canvas3.init(this.initChart, 3);
    this.setData({
      chartsInited: true,
    });
  },

  updateCharts: function() {
    pie1.changeData(this.data.healthData);
    pie2.changeData(this.data.distributeData);
    pie3.changeData(this.data.contactData);
  },


  initChart: function(canvas, width, height, instanceId) {
    // console.log(instanceId);
    const pie = new F2.Chart({
      el: canvas,
      width,
      height
    });
    // eslint-disable-next-line no-nested-ternary
    const data = instanceId === 1 ? this.data.healthData :
      (instanceId === 2 ? this.data.distributeData : this.data.contactData);
    pie.source(data);
    pie.coord('polar', {
      transposed: true,
      radius: 0.75
    });
    pie.legend(false);
    pie.axis(false);
    pie.tooltip(false);
    pie.pieLabel({
      sidePadding: 16,
      // eslint-disable-next-line func-names
      label1: function label1(_data, color) {
        return {
          text: _data.name,
          fill: color
        };
      },
      // eslint-disable-next-line func-names
      label2: function label2(_data) {
        return {
          text: `${_data.value}人 (${_data.percent})`,
          fill: '#808080',
          fontWeight: 'bold'
        };
      }
    });

    pie.interval()
      .position('const*value')
      .color('name', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864' ])
      .adjust('stack');
    pie.render();

    switch (instanceId) {
    case 1:
      pie1 = pie;

      return pie1;
    case 2:
      pie2 = pie;

      return pie2;
    case 3:
      pie3 = pie;

      return pie3;
    default:
      return null;
    }
  },

  formatSymptom: function(symptoms) {
    // if (symptoms.length === 0) {
    //   return [];
    // }
    return symptoms.map(item => item.detail);
  }
});
