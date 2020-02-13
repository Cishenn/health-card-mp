import { wechatLogin } from './api/service/user';
import { getInformation } from './api/service/report';



App({
  onLaunch: function() {
    wechatLogin().then(() => {
      getInformation().then(res => {
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
