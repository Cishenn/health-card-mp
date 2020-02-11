// pages/post/post-detail/post-detail.js
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
    wx.request({
      url: `${getApp().globalData.apiUrl}group/${options.id}`,
      success: res => {
        groupInfo = res.data;
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
      groupInfo,
      announcement
    });
  }
});