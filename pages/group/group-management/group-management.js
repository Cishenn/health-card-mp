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

  goToGroupInfoModify: function() {
    const id = this.data.groupDetail.id;
    const name = this.data.groupDetail.name;
    const description = this.data.groupDetail.description;
    const managerName = this.data.groupDetail.managerName;
    const managerPhone = this.data.groupDetail.managerPhone;
    const type = this.data.groupDetail.type;
    console.log(`/pages/group/create-group/create-group?id=${id}&name=${name}&description=${description}&managername=${managerName}&managerphone=${managerPhone}&type=${type}`);
    wx.navigateTo({
      url: `/pages/group/create-group/create-group?id=${id}&name=${name}&description=${description}&managername=${managerName}&managerphone=${managerPhone}&type=${type}`
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