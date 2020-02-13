import { wechatLogin } from './api/service/user';
import { getInformation } from './api/service/report';
import { emitLogin } from './utils/events';

App({
  onLaunch: function() {
    wechatLogin()
      .then(() => {
        return getInformation().then(res => {
          console.log(res);
          this.globalData.hasGroup = res.data.hasGroup;
          this.globalData.hasSubmit = res.data.isSubmit;
          this.globalData.name = res.data.name;
          this.globalData.phone = res.data.phone;
          if (res.data.phone === '社区') {
            this.globalData.role = 'community';
          }
        }).catch(err => {
          console.log(err);
        });
      })
      .then(() => {
        emitLogin();
      }).catch(err => {
        console.error(err);

        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 1500,
        });
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
