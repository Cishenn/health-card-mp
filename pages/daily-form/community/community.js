// pages/daily-form/community/community.js
import { getReport, createReport, postSubscribe } from '../../../api/service/report';
import dayjs from 'dayjs';
import areaList from '../../../common/js/area';

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
    door: null,
    location: '',
    status: '',
    symptoms: [],
    familyList: [],
    message: '',
    touch: '',

    // 填写某个家属信息时，将下面的值设为该家属在familyList中的索引
    currentFamilyIndex: -1,
    hasLocation: false,
    hasStatus: false,
    hasSymptoms: false,
    hasConnected: false,
    hasTouchd: false,

    areaList: areaList,
    touchList: ['是', '否'],
    locationList: ['武汉市内', '湖北省内', '国内', '国外', '本社区'],
    statusList: ['正常', '疑似', '确诊', '自查异常'],
    symptomsList: ['无症状', '发热', '咳嗽', '食欲不佳', '乏力', '肌肉酸痛', '气促', '腹泻', '结膜充血']
  },

  attached: function() {
    let time = dayjs();
    const days = ['日', '一', '二', '三', '四', '五', '六'];

    this.setData({
      dayTime: this.properties.newTime
    });

    getReport(this.data.groupId).then(res => {
      if (res.data.length === 0 ) {
        return;
      }
      const tmp = res.data[0];
      time = dayjs(tmp.createdAt);
      let setsymptoms = tmp.symptoms.map(item => {
        return item.detail;
      });
      const flist = tmp.members.map(item => {
        const tmpit = item;
        tmpit.symptoms = item.symptoms.map(it => {
          return it.detail;
        });

        return tmpit;
      });

      // 如果返回的数据的日期不是今天，即今天尚未打卡，则清空位置、症状等信息
      if (!dayjs(res.data[0].createdAt).isSame(dayjs(), 'date')) {
        setsymptoms = [];
        tmp.location = '';
        tmp.message = '';
        tmp.status = '';
        tmp.contact = '';
        flist.forEach(member => {
          member.status = '';
          member.location = '';
          member.symptoms = [];
        });
      }
      this.setData({
        door: tmp.address,
        location: tmp.location,
        status: tmp.status,
        touch: tmp.contact,
        symptoms: setsymptoms,
        familyList: flist,
        message: tmp.other,
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
        hasTouched: false,
      });
    },

    onAreaConfirm(res) {
      if (this.data.hasSubmit) {
        this.onAreaCancel();

        return;
      }
      let location = res.detail.values;
      if (!location[2]) {
        // 三列地址中，如果最后一项为空即undefined，移除最后一项
        location.pop();
      }
      location = res.detail.values.map(obj => obj.name);
      // 去掉三列地址中重复的名称
      for (let i = 1; i < location.length; ++ i) {
        while (location[i - 1] === location[i] && i < location.length) {
          location.splice(i, 1);
        }
      }

      const index = this.data.currentFamilyIndex;
      if (index === -1) {
        this.setData({
          location,
          hasLocation: false,
        });
      }
      else {
        const familyList = this.data.familyList;
        familyList[index].location = location;
        familyList[index].hasLocation = false;
        this.setData({
          familyList,
          currentFamilyIndex: -1,
        });
      }
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
        hasTouched: false,
      });
      // console.log(this.data[key]);
    },
    clickSymptoms(event) {
      const { index } = event.currentTarget.dataset;
      const checkbox = this.selectComponent(`.checkboxes-${index}`);
      checkbox.toggle();
    },

    addFamily() {
      const tmplist = this.data.familyList;
      // console.log('add', this.data.familyList);
      tmplist.push({
        name: '',
        phone: '',
        location: '',
        status: '',
        symptoms: [],
        hasLocation: false,
        hasStatus: false,
        hasSymptoms: false,
        hasTouched: false,
      });
      this.setData({
        familyList: tmplist
      });
    },
    deleteFamily(event) {
      const self = this;
      const index = event.currentTarget.dataset.mainIndex;
      // console.log(event.currentTarget.dataset);
      wx.showModal({
        content: '是否确认删除该家属信息',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            const tmplist = self.data.familyList;
            tmplist.splice(index, 1);
            self.setData({
              familyList: tmplist
            });
          }
          else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },

    changeItemValue(e) {
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.source;
      // console.log(index, key, e.currentTarget.dataset);
      const tmplist = this.data.familyList;
      tmplist[index][key] = e.detail;
      tmplist[index]['hasLocation'] = false;
      tmplist[index]['hasStatus'] = false;
      this.setData({
        familyList: tmplist
      });
      // console.log(this.data);
    },

    showItem(e) {
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.status;
      // console.log(index, key, e.currentTarget.dataset);
      const tmplist = this.data.familyList;
      tmplist[index][key] = true;
      this.setData({
        currentFamilyIndex: index,
        familyList: tmplist
      });
      // console.log(this.data);
    },
    closeItem(e) {
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.status;
      const tmplist = this.data.familyList;
      tmplist[index][key] = false;
      this.setData({
        currentFamilyIndex: -1,
        familyList: tmplist
      });
      // console.log(this.data);
    },

    clickItem(e) {
      const { name } = e.currentTarget.dataset;
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.source;
      const tmplist = this.data.familyList;
      tmplist[index][key] = name;
      tmplist[index]['hasLocation'] = false;
      tmplist[index]['hasStatus'] = false;
      this.setData({
        familyList: tmplist
      });
      // console.log(this.data.familyList);
    },
    clickItemSymptoms(e) {
      const { index } = e.currentTarget.dataset;
      const maninIndex = e.currentTarget.dataset.mainIndex;
      const checkbox = this.selectComponent(`.checkboxes-${maninIndex}-${index}`);
      checkbox.toggle();
    },
    submit() {
      let symptomsEmpty = this.data.symptoms.length === 0 ? true : false;
      this.data.familyList.forEach(member => {
        symptomsEmpty = member.symptoms.length === 0 ? true : false;
      });
      if (!this.data.door || !this.data.location || !this.data.status ||
          !this.data.touch || symptomsEmpty) {
        wx.showToast({
          title: '个人信息有空',
          icon: 'none',
          duration: 2000
        });

        return;
      }
      const uncompleteList = this.data.familyList.filter(member => {
        return (!member.name || !member.phone || !member.location || !member.status);
      });
      if (uncompleteList.length > 0) {
        wx.showToast({
          title: '家属信息有空',
          icon: 'none',
          duration: 2000
        });


        return;
      }
      const data = {
        groupId: this.data.groupId,
        type: '社区',
        name: this.data.name,
        phone: this.data.phone,
        address: this.data.door,
        location: this.data.location,
        status: this.data.status,
        contact: this.data.touch,
        other: this.data.message,
        symptoms: this.data.symptoms,
        members: this.data.familyList,
        familyNumber: null,
        illNumber: null,
        schoolId: null,
        identity: null
      };
      const self = this;

      wx.requestSubscribeMessage({
        tmplIds: ['XWrCEfaxxzElgjfmr5jhACv3-45UiJgUAm0_cRYgk48'],
        success(res) {
          console.log(res, '订阅成功');
          wx.showLoading();
          postSubscribe();
        },
        fail(res) {
          console.log('订阅err', res);
          wx.showLoading();
        },
        complete() {
          createReport(data).then(() => {
            wx.hideLoading();
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
            wx.hideLoading();
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
