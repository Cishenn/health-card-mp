// pages/post/post-detail/post-detail.js
import { getGroupDetail, getAnnouncement } from '../../../api/service/group.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: null,
    announcement: null
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '公告详情'
    });
    let groupInfo = null;
    let announcement = null;
    getGroupDetail(options.id).then(res => {
      groupInfo = res.data;
    }).catch(err => {
      console.error(err);
    });
    getAnnouncement(options.id).then(res => {
      announcement = res.data;
    }).catch(err => {
      console.error(err);
    });
    this.setData({
      groupInfo,
      announcement
    });
  }
});