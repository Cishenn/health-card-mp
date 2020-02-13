// pages/group/group-management/group-management.js
import { getGroupDetail, getAnnouncement, getMembers } from '../../../api/service/group.js';
Page({

  data: {
    groupDetail: null,
    announcement: null,
    members: []
  },

  goToPostManagement: function() {
    wx.navigateTo({
      url: `/pages/post/post-management/post-management?id=${this.data.groupDetail.id}`
    });
  },

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '小组管理'
    });
    const groupId = options.id;
    Promise.all([
      getGroupDetail(groupId),
      getAnnouncement(groupId),
      getMembers(groupId)
    ]).then(res => {
      this.setData({
        groupDetail: res[0].data,
        announcement: res[1].data,
        members: res[2].data
      });
    });
  }
});