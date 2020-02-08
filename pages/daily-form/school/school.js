// pages/daily-form/community/community.js

Component({
  properties: {

  },
  data: {
    dayTime: '',
    name: 'xxx',
    telephone: '18876552526',
    schoolRole: '',
    schoolId: '',
    location: '',
    status: '',
    symptoms: [],
    message: '',
    familyNum: '',
    familyUnhealthyNum: '',


    hasRole: false,
    hasLocation: false,
    hasStatus: false,
    hasSymptoms: false,

    schoolRoleList: ['教职工', '学生'],
    locationList: ['武汉市内', '湖北省内', '国内', '国外', '本校'],
    statusList: ['正常', '疑似', '确诊', '自查异常'],
    symptomsList: ['发热', '咳嗽', '食欲不佳', '乏力', '肌肉酸痛', '气促', '腹泻', '结膜充血']
  },

  attached: function() {
    const time = new Date();
    this.setData({
      dayTime: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
    });
  },
  methods: {
    changeValue(e) {
      const key = e.currentTarget.dataset.source;
      console.log(key);
      this.setData({
        [key]: e.detail
      });
      console.log(this.data);
    },

    show(e) {
      const key = e.currentTarget.dataset.status;
      this.setData({
        [key]: true
      });
    },
    close(e) {
      const key = e.currentTarget.dataset.status;
      this.setData({
        [key]: false
      });
    },
    clickShow(e) {
      const { name } = e.currentTarget.dataset;
      const key = e.currentTarget.dataset.source;
      this.setData({
        [key]: name
      });
      console.log(this.data[key]);
    },
    clickSymptoms(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },


    clickItemSymptoms(e) {
      const { index } = e.currentTarget.dataset;
      const maninIndex = e.currentTarget.dataset.mainIndex;
      const checkbox = this.selectComponent(`.checkboxes-${maninIndex}-${index}`);
      checkbox.toggle();
    },
    submit() {
      let flag = true;
      if (!this.data.location || !this.data.status || !this.data.schoolId || !this.data.schoolRole || !this.data.familyNum || !this.data.familyUnhealthyNum) {
        wx.showToast({
          title: '个人信息有空',
          icon: 'none',
          duration: 2000
        });
        flag = false;
      }
      if (flag) {
        console.log('submit');
      }
    }
  }

});
