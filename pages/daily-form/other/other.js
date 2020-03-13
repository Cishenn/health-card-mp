// pages/daily-form/community/community.js
import { getReport, createReport, postSubscribe } from '../../../api/service/report';
import dayjs from 'dayjs';
import { convertCodeToStringArray, convertComfirmResultToStringArray,
  areaList } from '../../../common/js/area';

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
    // 地区代码
    location: '110101',
    // ['省','市','区']
    locationArray: [],
    status: '',
    touch: '',
    symptoms: [],
    message: '',
    // familyNum: '',
    // familyUnhealthyNum: '',

    areaList: areaList,
    hasRole: false,
    hasLocation: false,
    hasStatus: false,
    hasTouch: false,
    hasSymptoms: false,

    schoolRoleList: ['教职工', '学生'],
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
      // console.log(res);
      if (res.data.length === 0 ) {
        return;
      }
      const tmp = res.data[0];
      time = dayjs(tmp.createdAt);
      let setsymptoms = tmp.symptoms.map(item => {
        return item.detail;
      });
      let locationArray = [];
      let touch = tmp.contact ? '是' : '否';

      // 如果返回的数据的日期不是今天，即今天尚未打卡，则清空位置、症状等信息
      if (!dayjs(res.data[0].createdAt).isSame(dayjs(), 'date')) {
        setsymptoms = [];
        tmp.message = '';
        tmp.status = '';
        touch = '';
      }
      else {
        locationArray = convertCodeToStringArray(tmp.location);
      }
      this.setData({
        door: tmp.address,
        location: tmp.location,
        locationArray,
        status: tmp.status,
        touch,
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
        hasTouch: false
      });
      // console.log(this.data);
    },

    onAreaConfirm(res) {
      if (this.data.hasSubmit) {
        this.onAreaCancel();

        return;
      }
      const location = res.detail.values[2] ?
        res.detail.values[2].code : res.detail.values[1].code;
      const locationArray = convertComfirmResultToStringArray(res.detail.values);
      this.setData({
        location,
        locationArray,
        hasLocation: false,
      });
    },

    onAreaCancel() {
      this.setData({
        hasLocation: false,
      });
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
        hasStatus: false,
        hasTouch: false,
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
        contact: this.data.touch === '是' ? true : false,
        other: this.data.message,
        symptoms: this.data.symptoms,
        // familyNumber: this.familyNumber.toString(),
        // illNumber: this.familyUnhealthyNum.toString(),
        schoolId: null,
        identity: null,
        members: []
      };
      const self = this;

      wx.showLoading();
      wx.requestSubscribeMessage({
        tmplIds: ['XWrCEfaxxzElgjfmr5jhACv3-45UiJgUAm0_cRYgk48'],
        success(res) {
          console.log(res, '订阅成功');
          postSubscribe();
        },
        fail(res) {
          console.error('订阅err', res);
        },
        complete() {
          createReport(data)
            .then(() => {
              return getReport(self.data.groupId);
            })
            .then(res => {
              const days = ['日', '一', '二', '三', '四', '五', '六'];
              const dayTime = dayjs(res.data[0].createdAt);
              self.setData({
                dayTime: `${dayTime.format('YYYY年MM月DD日')} 星期${days[dayTime.day()]} ${dayTime.format('HH:mm')}`
              });
            })
            .then(() => {
              wx.hideLoading();
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                duration: 2000
              });
              self.setData({
                hasSubmit: true
              });
              self.triggerEvent('clockin', {}, {
                bubbles: true,
                composed: true,
              });
            })
            .catch(err => {
              console.error(err);
              wx.hideLoading();
              wx.showToast({
                title: '提交失败',
                icon: 'none',
                duration: 2000
              });
            });
        }
      });
    }
  }

});
