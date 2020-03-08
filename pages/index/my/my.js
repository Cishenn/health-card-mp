import { setAvatarUrl } from '../../../api/service/user';
import Dialog from '@vant/weapp/dialog/dialog';

Page({

  data: {
    name: '',
    avatarUrl: 'https://img.yzcdn.cn/vant/cat.jpeg',
    logIn: false,
  },
  onLoad: function() {
    const globalData = getApp().globalData;
    this.setData({
      logIn: globalData.avatarUrl ? true : false,
      name: globalData.name,
      avatarUrl: globalData.avatarUrl,
    });
  },

  getAvatarAndName: function() {
    const that = this;
    wx.getUserInfo({
      success: function(res) {
        const avatarUrl = res.userInfo.avatarUrl;
        const name = getApp().globalData.name || res.userInfo.nickName;
        getApp().globalData.avatarUrl = avatarUrl;
        that.setData({
          logIn: true,
          avatarUrl,
          name,
        });
        setAvatarUrl(avatarUrl).catch(err => {
          console.error(err);
        });
      }
    });
  },

  toMyInfo: function() {
    if (!this.data.logIn) {
      Dialog.alert({
        message: '请先登录',
      });

      return;
    }
    wx.navigateTo({
      url: '/pages/index/my/my-info/my-info',
    });
  },
});
