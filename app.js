// app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
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
    GroupList: [
      {
        id: 1,
        type: 'school',
        name: '兰州大学计算机学院一班',
        digest: '兰州大学计算机学院学生疫情期间打卡群',
        post: '请大家于明天中午12点之前在XXX地点统一领取口罩。',
        maintainer: {
          name: '小明',
          phone: '13766668888',
        }
      },
      {
        id: 2,
        type: 'community',
        name: '监利县xx小区',
        digest: '',
        post: '',
        maintainer: {
          name: '小明',
          phone: '13766668888',
        }
      },
      {
        id: 3,
        type: 'community',
        name: '监利县书香四季城A栋小区',
        digest: '',
        post: '',
        maintainer: {
          name: '小明',
          phone: '13766668888',
        }
      },
      {
        id: 4,
        type: 'community',
        name: '监利县书香四季城A栋小区',
        digest: '',
        post: '',
        maintainer: {
          name: '小明',
          phone: '13766668888',
        }
      }
    ]
  }
});