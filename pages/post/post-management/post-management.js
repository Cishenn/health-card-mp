// pages/post/post-management/post-management.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newPost: '',
    groupInfo: {
      id: 1,
      type: 'school',
      name: '兰州大学计算机学院一班',
      digest: '兰州大学计算机学院学生疫情期间打卡群',
      post: {
        time: '2020-02-08 09:00',
        content: '请大家于明天中午12点之前在XXX地点统一领取口罩。'
      }
    }
  },

  inputPost: function(e) {
    this.setData({
      newPost: e.detail
    });
  },
});