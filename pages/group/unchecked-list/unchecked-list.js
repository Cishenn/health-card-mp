// pages/group/unchecked-list/unchecked-list.js
import { getAllMembers, getClockInDetail } from '../../../api/service/group';

Page({
  data: {
    uncheckedList: [],
    date: '',
    groupname: '',
    groupId: null,
  },

  onLoad: function(options) {
    const groupId = options.id;
    const date = options.date;
    const groupname = options.name;
    const displayedDate = `${date.substr(4, 2)}-${date.substr(6, 2)}`;

    Promise.all([
      getAllMembers(groupId),
      getClockInDetail(groupId, date),
    ]).then(res => {
      let allMembers = res[0].data;
      let checkedMembers = res[1].data;
      const uncheckedList = [];
      allMembers = allMembers.map(member => JSON.stringify({
        userId: member.UserGroup.UserId,
        userName: member.name,
      }));
      checkedMembers = checkedMembers.map(member => JSON.stringify({
        userId: member.UserGroup.UserId,
        userName: member.name,
      }));
      checkedMembers.forEach(member => {
        if (allMembers.has(member)) {
          allMembers.delete(member);
        }
      });
      allMembers.forEach(member => {
        uncheckedList.push(JSON.parse(member).userName);
      });
      this.setData({
        groupId,
        groupname,
        date: displayedDate,
        uncheckedList,
      });
    });
  },

  onShareAppMessage: function() {
    return {
      title: `你加入的“${this.data.groupname}”小组，今天还没有打卡哦，戳我速速打卡！`,
      // path: `/pages/group/group-detail/group-detail?managed=0&id=${this.data.groupId}`,
      path: `/pages/group/group-detail/group-detail?id=${this.data.groupId}`,
    };
  },
});
