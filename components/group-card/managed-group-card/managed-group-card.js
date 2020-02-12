// components/group-card/managed-group-card/managed-group-card.js
Component({
  properties: {
    groupInfo: {
      type: Object,
      value: {
        invitationCode: '',
        name: ''
      }
    }
  },

  data: {

  },

  methods: {
    goToGroup() {
      wx.navigateTo({
        url: `/pages/group/group-detail/group-detail?managed=1&id=${this.data.groupInfo.id}`
      });
    },
    // goInvite() {},
    goToManage() {
      wx.navigateTo({
        url: '/pages/group/group-management/group-management'
      });
    }
  }
});
