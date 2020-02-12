// pages/post/post-management/post-management.js
import Toast from '@vant/weapp/toast/toast';
import { getAnnouncement, setAnnouncement } from '../../../api/service/group.js';
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
    getAnnouncement(options.id).then(res => {
      announcement = res.data;
    }).catch(err => {
      console.error(err);
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
    setAnnouncement(this.data.groupId, this.data.newPost).then(() => {
      wx.navigateBack();
    }).catch(err => {
      console.error(err);
      Toast('修改失败');
    });
  }
});