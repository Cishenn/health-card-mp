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
      const announcement = res[1].data.length === 0 ? null : res[1].data[0];
      const announcementPostTime =
          announcement ? this.formatTime(announcement.updatedAt) : '';
      this.setData({
        groupInfo: res[0].data,
        announcement,
        announcementPostTime
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
