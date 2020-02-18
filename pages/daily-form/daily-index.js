// pages/daily-form/daily-index.js

import { getInformation } from '../../api/service/report';
import dayjs from 'dayjs';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasGroup: null,
    role: null,
    hasSubmit: null,
    name: null,
    phone: null,
    newTime: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function() {
    const app = getApp();
    const hasGroup = app.globalData.hasGroup;
    const role = app.globalData.role;
    const hasSubmit = app.globalData.hasSubmit;
    // console.log(hasGroup);
    this.setData({
      hasGroup: hasGroup,
      role: role,
      hasSubmit: hasSubmit
    });
    // console.log(this.data);
    if (hasGroup) {
      wx.setNavigationBarTitle({
        title: '新型肺炎日报',
      });
    }
    const time = dayjs();
    const days = ['日', '一', '二', '三', '四', '五', '六'];


    getInformation()
      .then(res => {
        app.globalData.hasGroup = res.data.hasGroup;
        app.globalData.hasSubmit = res.data.isSubmit;
        app.globalData.name = res.data.name;
        app.globalData.phone = res.data.phone;
        if (res.data.phone === '社区') {
          app.globalData.role = 'community';
        }
        this.setData({
          name: res.data.name,
          phone: res.data.phone,
          hasGroup: res.data.hasGroup,
          role: app.globalData.role,
          hasSubmit: res.data.isSubmit,
          newTime: `${time.format('YYYY年MM月DD日')} 星期${days[time.day()]} ${time.format('HH:mm')}`
        });

        // console.log(this.data.hasGroup, 'onShow');
      });
  }

});
