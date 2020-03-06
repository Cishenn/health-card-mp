// components/group-card/managed-group-card/managed-group-card.js
Component({
  properties: {
    groupInfo: {
      type: Object,
      value: {
        id: '',
        invitationCode: '',
        checked: false,
        name: ''
      }
    }
  },

  data: {

  },

  methods: {
    goToGroup() {
      wx.navigateTo({
        // url: `/pages/group/group-detail/group-detail?managed=1&id=${this.data.groupInfo.id}`
        url: `/pages/group/group-detail/group-detail?id=${this.data.groupInfo.id}`
      });
    },

    goToManage() {
      wx.navigateTo({
        url: `/pages/group/group-management/group-management?id=${this.data.groupInfo.id}`
      });
    }
  }
});
