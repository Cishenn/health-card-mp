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
    getAnnouncement(options.id).then(res => {
      this.setData({
        groupId: options.id,
        announcement: res.data
      });
    }).catch(err => {
      console.error(err);
    });
  },

  inputPost: function(e) {
    this.setData({
      newPost: e.detail
    });
  },

  commit: function() {
    setAnnouncement(this.data.groupId, this.data.newPost).then(() => {
      Toast('修改成功');
      setTimeout(() => {
        wx.navigateBack();
      }, 1000);
    }).catch(err => {
      console.error(err);
      Toast('修改失败');
    });
  }
});