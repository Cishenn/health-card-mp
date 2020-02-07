// components/group-card/maintained-group-card/maintained-group-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    groupInfo: {
      type: Object,
      value: {
        id: 0,
        type: '',
        name: '',
        digest: '',
        post: '',
        maintainer: {
          name: '',
          phone: 0,
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goInvite() {},
    goManage() {}
  }
})
