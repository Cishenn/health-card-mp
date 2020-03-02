import { wechatLogin } from './api/service/user';
import { getInformation } from './api/service/report';
import { emitLogin } from './utils/events';

App({
  onLaunch: function() {
    wechatLogin()
      .then(() => {
        return getInformation();
      })
      .then(res => {
        this.globalData.hasGroup = res.data.hasGroup;
        this.globalData.hasSubmit = res.data.isSubmit;
        this.globalData.name = res.data.name;
        this.globalData.phone = res.data.phone;
        if (res.data.phone === '社区') {
          this.globalData.role = 'community';
        }

        emitLogin();
      })
      .catch(err => {
        console.error(err);
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 1500,
        });
      });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;
              console.log('get it!');
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }
            }
          });
        }
      }
    });
  },
  globalData: {
    userInfo: null,
    hasGroup: true,
    role: 'community',
    hasSubmit: false,
    name: null,
    phone: null
  }
});
