// components/group-card/maintained-group-card/maintained-group-card.js
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
        url: `/pages/group/group-detail/group-detail?maintained=1&id=${this.data.groupInfo.id}`
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
