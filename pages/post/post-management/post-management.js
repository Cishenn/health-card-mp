// pages/post/post-management/post-management.js
import Toast from '@vant/weapp/toast/toast';
Page({
  data: {
    newPost: '',
    groupId: '',
    announcement: null
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '修改公告'
    });
    let announcement = null;
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
      groupId: options.id,
      announcement
    });
  },

  inputPost: function(e) {
    this.setData({
      newPost: e.detail
    });
  },

  commit: function() {
    wx.request({
      url: `${getApp().globalData.apiUrl}group/${this.data.groupId}/announcement`,
      method: 'POST',
      success: () => {
        wx.navigateBack();
      },
      fail: err => {
        console.log(err);
        Toast('修改失败');
      }
    });
  }
});