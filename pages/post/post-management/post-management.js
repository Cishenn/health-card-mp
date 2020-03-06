// pages/post/post-management/post-management.js
import Toast from '@vant/weapp/toast/toast';
import { getAnnouncement, setAnnouncement, modifyAnnouncement } from '../../../api/service/group.js';
Page({
  data: {
    newPost: '',
    groupId: '',
    announcement: null,
    disabled: false,
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '修改公告'
    });
    this.setData({
      groupId: options.id,
    });
  },

  onShow: function() {
    const id = this.data.groupId;
    getAnnouncement(id).then(res => {
      let announcement = null;
      let newPost = '';
      if (res.data.length !== 0) {
        announcement = res.data[0];
        newPost = announcement.checkContent ? announcement.checkContent : announcement.content;
      }
      this.setData({
        announcement,
        newPost,
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
    const id = this.data.groupId;
    const newPost = this.data.newPost.trim();
    if (newPost === '') {
      Toast('新公告不能为空哦~');

      return;
    }
    this.setData({
      disabled: true
    });
    new Promise(resolve => {
      resolve();
    })
      .then(() => {
        if (!this.data.announcement) {
          return setAnnouncement(id, newPost);
        }

        return modifyAnnouncement(id, newPost);
      })
      .then(res => {
        const resulte = res.data;
        console.log(resulte);
        if (resulte.errcode === 0) {
          Toast('修改成功');
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        }
        else {
          Toast('修改失败');
        }
      })
      .catch(err => {
        console.error(err);
      })
      .finally(() => {
        this.setData({
          disabled: false,
        });
        this.onShow();
      });
  }
});
