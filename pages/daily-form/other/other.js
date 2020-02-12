// pages/daily-form/community/community.js
import { getReport, createReport } from '../../../api/service/report';

Component({
  properties: {
    hasSubmit: {
      type: 'Boolean'
    }
  },
  data: {
    dayTime: '',
    name: 'xxx',
    phone: '18876552526',
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
    const app = getApp();
    this.setData({
      dayTime: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`,
      name: app.globalData.name,
      phone: app.globalData.phone
    });
    if (this.properties.hasSubmit) {
      getReport().then(res => {
        console.log(res);
        if (res.data.length === 0 ) {
          wx.showToast({
            title: '获取日报失败',
            icon: 'none',
            duration: 2000
          });

          return;
        }
        const tmp = res.data[0];
        const setsymptoms = tmp.symptoms.map(item => {
          return item.detail;
        });
        const flist = tmp.members.map(item => {
          const tmpit = item;
          tmpit.symptoms = item.symptoms.map(it => {
            return it.detail;
          });

          return tmpit;
        });
        this.setData({
          door: tmp.address,
          location: tmp.location,
          status: tmp.status,
          symptoms: setsymptoms,
          familyList: flist,
          message: tmp.other
        });
      }).catch(() => {
        wx.showToast({
          title: '获取日报失败',
          icon: 'none',
          duration: 2000
        });
      });
    }
  },
  methods: {
    changeValue(e) {
      const key = e.currentTarget.dataset.source;
      console.log(key);
      this.setData({
        [key]: e.detail,
        hasLocation: false,
        hasStatus: false
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
        [key]: name,
        hasLocation: false,
        hasStatus: false
      });
      console.log(this.data[key]);
    },
    clickSymptoms(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },

    submit() {
      if (!this.data.location || !this.data.status || !this.data.schoolId || !this.data.schoolRole || !this.data.familyNum || !this.data.familyUnhealthyNum) {
        wx.showToast({
          title: '个人信息有空',
          icon: 'none',
          duration: 2000
        });

        return;
      }
      const data = {
        type: '其他',
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.location,
        location: this.data.location,
        status: this.data.status,
        other: this.data.message,
        symptoms: this.data.symptoms,
        familyNumber: this.familyNumber.toString(),
        illNumber: this.familyUnhealthyNum.toString(),
        schoolId: null,
        identity: null,
        members: []
      };
      console.log(data);
      createReport(data).then(() => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        this.setData({
          hasSubmit: true
        });
      });

      console.log('submit');
    }
  }

});
