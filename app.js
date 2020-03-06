import { wechatLogin, getUserInfo } from './api/service/user';
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

        return getUserInfo();

        // emitLogin();
      })
      .then(res => {
        const userInfo = res.data;
        if (!this.globalData.name) {
          this.globalData.name = userInfo.name;
        }
        if (!this.globalData.phone) {
          this.globalData.phone = userInfo.phone;
        }
        this.globalData.userId = userInfo.id;

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
  },
  globalData: {
    userId: null,
    hasGroup: true,
    role: 'community',
    hasSubmit: false,
    name: null,
    phone: null
  }
});
