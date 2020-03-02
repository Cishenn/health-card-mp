// pages/index/clock-in/clock-in.js
Page({

  data: {
    nickName: '',
    avatarUrl: '',

  },
  onLoad: function() {
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl
      });
    }
    else {
      this.setData({
        nickName: 'sd',
        avatarUrl: 'https://img.yzcdn.cn/vant/cat.jpeg'
      });
      console.log('Can\'t access the user\'s global avatar and name');
    }
  }
});