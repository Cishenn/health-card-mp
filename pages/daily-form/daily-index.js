// pages/daily-form/daily-index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasGroup: null,
    role: null

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    const app = getApp();
    const hasGroup = app.globalData.hasGroup;
    const role = app.globalData.role;
    console.log(hasGroup);
    this.setData({
      hasGroup: hasGroup,
      role: role
    });
    console.log(this.data);
    if (hasGroup) {
      wx.setNavigationBarTitle({
        title: '新型肺炎日报',
      });
    }
  }
});
