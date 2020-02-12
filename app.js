import { wechatLogin } from './api/service/user';
import { emitLogin } from './utils/events';

App({
  onLaunch: function() {
    wechatLogin()
      .then(() => {
        emitLogin();
      })
      .catch(error => {
        console.error(error);

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
  }
});
