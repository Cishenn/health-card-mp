// pages/group/group-management/group-management.js
Page({

  data: {
    groupInfo: null,
    announcement: null,
    members: []
  },

  goToPostManagement: function() {
    wx.navigateTo({
      url: `/pages/post/post-management/post-management?id=${this.data.groupInfo.id}`
    });
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '小组管理'
    });
    let groupInfo = null;
    let announcement = null;
    let members = [];
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
    wx.request({
      url: `${getApp().globalData.apiUrl}group/${options.id}/member`,
      success: res => {
        members = res.data.users;
      },
      fail: err => {
        console.log(err);
      }
    });
    this.setData({
      groupInfo,
      announcement,
      members
    });
  }
});