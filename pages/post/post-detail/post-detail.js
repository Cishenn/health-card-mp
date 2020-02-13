// pages/post/post-detail/post-detail.js
import { getGroupDetail, getAnnouncement } from '../../../api/service/group.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: null,
    announcement: null,
    announcementPostTime: null
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '公告详情'
    });
    Promise.all([
      getGroupDetail(options.id),
      getAnnouncement(options.id)
    ]).then(res => {
      this.setData({
        groupInfo: res[0].data,
        announcement: res[1].data,
        announcementPostTime: this.formatTime(res[1].data[0].updatedAt)
      });
    }).catch(err => {
      console.error(err);
    });
  },

  formatTime: function(time) {
    const cut = time.split('T');

    return `${cut[0]} ${cut[1].split('.')[0]}`;
  }
});