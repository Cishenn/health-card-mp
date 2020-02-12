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
    let groupDetail = null;
    let announcement = null;
    let members = [];
    getGroupDetail(groupId).then(res => {
      groupDetail = res.data;
    }).catch(err => {
      console.error(err);
    });
    getAnnouncement(groupId).then(res => {
      announcement = res.data;
    }).catch(err => {
      console.error(err);
    });
    getMembers(groupId).then(res => {
      members = res.data;
    }).catch(err => {
      console.error(err);
    });
    this.setData({
      groupDetail,
      announcement,
      members
    });
  }
});