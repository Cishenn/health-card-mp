import { wechatLogin } from './api/service/user';

App({
  onLaunch: function() {
    wechatLogin();
  },
  globalData: {
    userInfo: null,
    hasGroup: true,
    role: 'community',
    hasSubmit: false,
  }
});
