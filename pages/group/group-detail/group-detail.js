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
    clockInDetail: [],
    _chosenDate: 0,
    // chosenDate = getDate(_chosenDate)
    chosenDate: dayjs().format('YYYYMMDD'),
    latestDate: dayjs().format('YYYYMMDD'),
    firstDate: null,
    displayedDate: dayjs().format('MM-DD'),
    chartsInited: false,
    // showDetail: false 显示数据统计，true 显示详细数据
    showDetail: false,
    dialogOnShow: false,
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
      // 发现：好像如果echarts在init之后，其所在的view没有渲染或展示，再次展示时就会变成空白
      // 所以：要保证echarts在init时，必须是在展示的状态
      if (!this.data.chartsInited && this.data.clockInData.already !== 0 && this.data.showDetail === false) {
        this.initCharts();
      }
      else if (this.data.chartsInited && this.data.clockInData.already !== 0) {
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
      clockInDetail.map(item => (item.formatedTime = dayjs(item.reports[0].createdAt).format('MM-DD HH:mm')));
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
