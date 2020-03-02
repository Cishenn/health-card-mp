import { validatePhoneNumber } from '../../../../utils/validate';
import Toast from '@vant/weapp/toast/toast';
// pages/index/my/my-info/my-info.js
Page({

  data: {
    nickName: 'Bolster',
    phone: '13855146632'
  },

  toSave: function() {
    const nickName = this.data.nickName;
    const phone = this.data.phone;
    if (!nickName || !phone) {
      Toast('请填充完整信息');
      console.log('请填充完整信息');

      return;
    }
    else if (!validatePhoneNumber(phone)) {
      Toast('请输入正确的手机号码');
      console.log('请输入正确的手机号码');

      return;
    }
    else {
    // request
    }
  },

  getName: function(e) {
    this.setData({
      nickName: e.detail
    });
  },

  getPhone: function(e) {
    this.setData({
      phone: e.detail
    });
  }

});