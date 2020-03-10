// components/group-card/joined-group-card/joined-group-card.js
Component({
  properties: {
    groupInfo: {
      type: Object,
      value: {
        id: '',
        name: '',
        checked: false,
        announcements: [],
        UserGroup: {
          createdAt: '',
          updatedAt: '',
          GroupId: '',
          UserId: ''
        }
      }
    }
  },

  data: {

  },

  methods: {
    goToGroup() {
      wx.navigateTo({
        // url: `/pages/group/group-detail/group-detail?managed=0&id=${this.data.groupInfo.id}`
        url: `/pages/group/group-detail/group-detail?id=${this.data.groupInfo.id}&hasSubmit=${this.data.groupInfo.checked}`
      });
    }
  }
});
