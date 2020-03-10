// pages/daily-form/community/community.js
import { getReport, createReport, postSubscribe } from '../../../api/service/report';
import dayjs from 'dayjs';
Component({
  properties: {
    groupId: {
      type: Number,
    },
    hasSubmit: {
      type: 'Boolean'
    },
    name: {
      type: 'String'
    },
    phone: {
      type: 'String'
    },
    newTime: {
      type: 'String'
    }
  },
  data: {
    dayTime: '',
    schoolRole: '',
    schoolId: '',
    location: '',
    status: '',
    touch: '',
    symptoms: [],
    message: '',
    // familyNum: '',
    // familyUnhealthyNum: '',


    hasRole: false,
    hasLocation: false,
    hasStatus: false,
    hasTouched: false,
    hasSymptoms: false,

    schoolRoleList: ['教职工', '学生'],
    locationList: ['武汉市内', '湖北省内', '国内', '国外', '本校'],
    statusList: ['正常', '疑似', '确诊', '自查异常'],
    touchList: ['是', '否'],
    symptomsList: ['无症状', '发热', '咳嗽', '食欲不佳', '乏力', '肌肉酸痛', '气促', '腹泻', '结膜充血']
  },

  attached: function() {
    let time = dayjs();
    const days = ['日', '一', '二', '三', '四', '五', '六'];

    this.setData({
      dayTime: this.properties.newTime
    });

    getReport(this.data.groupId).then(res => {
      console.log(res);
      if (res.data.length === 0 ) {
        return;
      }
      const tmp = res.data[0];
      time = dayjs(tmp.createdAt);
      let setsymptoms = tmp.symptoms.map(item => {
        return item.detail;
      });

      // 如果返回的数据的日期不是今天，即今天尚未打卡，则清空位置、症状等信息
      if (!dayjs(res.data[0].createdAt).isSame(dayjs(), 'date')) {
        setsymptoms = [];
        tmp.location = '';
        tmp.message = '';
        tmp.status = '';
        tmp.contact = '';
      }
      this.setData({
        door: tmp.address,
        location: tmp.location,
        status: tmp.status,
        touch: tmp.contact,
        symptoms: setsymptoms,
        message: tmp.other,
        // familyNum: tmp.familyNum,
        // familyUnhealthyNum: tmp.familyUnhealthyNum,
        dayTime: `${time.format('YYYY年MM月DD日')} 星期${days[time.day()]} ${time.format('HH:mm')}`
      });
    }).catch(() => {
      wx.showToast({
        title: '获取日报失败',
        icon: 'none',
        duration: 2000
      });
    });
  },
  methods: {
    changeValue(e) {
      const key = e.currentTarget.dataset.source;
      // console.log(key);
      this.setData({
        [key]: e.detail,
        hasLocation: false,
        hasStatus: false,
        hasTouched: false
      });
      // console.log(this.data);
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
      // console.log(this.data[key]);
    },
    clickSymptoms(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },

    submit() {
      if (!this.data.location || !this.data.status || !this.data.touch ||
          !this.data.symptoms.length) {
        wx.showToast({
          title: '个人信息有空',
          icon: 'none',
          duration: 2000
        });

        return;
      }
      const data = {
        groupId: this.data.groupId,
        type: '其他',
        name: this.data.name,
        phone: this.data.phone,
        address: null,
        location: this.data.location,
        status: this.data.status,
        contact: this.data.touch,
        other: this.data.message,
        symptoms: this.data.symptoms,
        // familyNumber: this.familyNumber.toString(),
        // illNumber: this.familyUnhealthyNum.toString(),
        schoolId: null,
        identity: null,
        members: []
      };
      const self = this;

      wx.requestSubscribeMessage({
        tmplIds: ['XWrCEfaxxzElgjfmr5jhACv3-45UiJgUAm0_cRYgk48'],
        success(res) {
          console.log(res, '订阅成功');
          postSubscribe();
        },
        fail(res) {
          console.log('订阅err', res);
        },
        complete() {
          createReport(data).then(() => {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            });
            self.setData({
              hasSubmit: true
            });
          }).catch(err => {
            console.log(err);
            wx.showToast({
              title: '提交失败',
              icon: 'none',
              duration: 2000
            });
          });
        }
      });
      // console.log('submit');
    }
  }

});
