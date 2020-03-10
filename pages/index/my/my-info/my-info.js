import { validatePhoneNumber } from '../../../../utils/validate';
import { setNameAndPhone } from '../../../../api/service/user';
import Toast from '@vant/weapp/toast/toast';
// pages/index/my/my-info/my-info.js
Page({

  data: {
    name: '',
    phone: '',
    disabled: false,
  },

  onLoad: function() {
    this.setData({
      name: getApp().globalData.name,
      phone: getApp().globalData.phone,
    });
  },

  toSave: function() {
    const name = this.data.name.trim();
    const phone = this.data.phone.trim();
    if (!name || !phone) {
      Toast('请填写完整信息');

      return;
    }
    else if (!validatePhoneNumber(phone)) {
      Toast('请输入正确的手机号码');

      return;
    }

    this.setData({
      disabled: true,
    });
    setNameAndPhone(name, phone)
      .then(() => {
        Toast('修改成功');
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      })
      .catch(err => {
        console.error(err);
        Toast('抱歉，出错啦~');
      })
      .finally(() => {
        this.setData({
          disabled: false,
        });
      });
  },

  getName: function(e) {
    this.setData({
      name: e.detail
    });
  },

  getPhone: function(e) {
    this.setData({
      phone: e.detail
    });
  }

});
