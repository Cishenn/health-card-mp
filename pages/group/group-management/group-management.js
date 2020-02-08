// pages/group/group-management/group-management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: {
      id: 1,
      type: 'school',
      name: '兰州大学计算机学院一班',
      digest: '兰州大学计算机学院学生疫情期间打卡群',
      post: {
        time: '2020-02-08 09:00',
        content: '请大家于明天中午12点之前在XXX地点统一领取口罩。'
      },
      maintainer: {
        name: '小明',
        phone: 13766668888
      },
      member: [
        {
          name: '小明',
          phone: 13766668888
        },
        {
          name: '小明',
          phone: 13766668888
        },
        {
          name: '小明',
          phone: 13766668888
        },
        {
          name: '小明',
          phone: 13766668888
        }
      ]
    }
  },

  goToPostManagement: function() {
    wx.navigateTo({
      url: `/pages/post/post-management/post-management?id=${this.data.groupInfo.id}`
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '小组管理'
    });
    // eslint-disable-next-line no-unused-vars
    const id = options.id;
    // TODO: 由id获取groupInfo
  }
});