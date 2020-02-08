// pages/daily-form/community/community.js

Component({
  properties:{

  },
  data: {
    dayTime: "",
    name: "xxx",
    telephone:"18876552526",
    door: null,
    location: "",
    status:"",
    symptoms:[],
    familyList: [],
    message: "",

    hasLocation: false,
    hasStatus: false,
    hasSymptoms: false,

    locationList: ["武汉市内", "湖北省内", "国内", "国外", "本社区"],
    statusList: ["正常", "疑似", "确诊", "自查异常"],
    symptomsList: ["发热","咳嗽","食欲不佳","乏力","肌肉酸痛","气促","腹泻","结膜充血"]
  },

  attached: function (options) {
    const time = new Date();
    this.setData({
      dayTime: `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`
    })
  },
  methods: {
    changeValue(e) {
      const key = e.currentTarget.dataset.source;
      console.log(key)
      this.setData({
        [key]: e.detail
      });
      console.log(this.data);
    },

    show(e) {
      const key = e.currentTarget.dataset.status;
      this.setData({
        [key]: true
      })
    },
    close(e) {
      const key = e.currentTarget.dataset.status;
      this.setData({
        [key]: false
      })
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
    noop() { },

    addFamily() {
      const tmplist = this.data.familyList;
      console.log('add', this.data.familyList);
      tmplist.push({
        name: "",
        telephone: "",
        location: "",
        status: "",
        symptoms: [],
        hasLocation: false,
        hasStatus: false,
        hasSymptoms: false,
      })
      this.setData({
        familyList: tmplist
      });
    },
    deleteFamily(event) {
      const self = this;
      const index = event.currentTarget.dataset.mainIndex;
      console.log(event.currentTarget.dataset)
      wx.showModal({
        content: '是否确认删除该家属信息',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')      
            const tmplist = self.data.familyList;
            tmplist.splice(index, 1);
            self.setData({
              familyList: tmplist
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    },
    
    changeItemValue(e) {
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.source;
      console.log(index, key, e.currentTarget.dataset)
      const tmplist = this.data.familyList;
      tmplist[index][key] = e.detail;
      this.setData({
        familyList: tmplist
      });
      console.log(this.data);
    },

    showItem(e) {
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.status;
      console.log(index, key, e.currentTarget.dataset)
      const tmplist = this.data.familyList;
      tmplist[index][key] = true;
      this.setData({
        familyList: tmplist
      });
      console.log(this.data);
    },
    closeItem(e) {
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.status;
      const tmplist = this.data.familyList;
      tmplist[index][key] = false;
      this.setData({
        familyList: tmplist
      });
      console.log(this.data);
    },

    clickItem(e) {
      const { name } = e.currentTarget.dataset;
      const index = e.currentTarget.dataset.mainIndex;
      const key = e.currentTarget.dataset.source;
      const tmplist = this.data.familyList;
      tmplist[index][key] = name;
      this.setData({
        familyList: tmplist
      });
      console.log(this.data.familyList);
    },
    clickItemSymptoms(e) {
      const { index } = e.currentTarget.dataset;
      const maninIndex = e.currentTarget.dataset.mainIndex;
      const checkbox = this.selectComponent(`.checkboxes-${maninIndex}-${index}`);
      checkbox.toggle();
    },
    submit() {
      var flag = true;
      if (!this.data.door || !this.data.location || !this.data.status) {
        wx.showToast({
          title: '个人信息有空',
          icon: 'none',
          duration: 2000
        });
        flag = false;
      }
      if (this.data.familyList.length > 0) {
        const tmplist = this.data.familyList;
        for (var i = 0 ; i < tmplist.length; i ++) {
          if (!tmplist[i].name || !tmplist[i].telephone || !tmplist[i].location || !tmplist[i].status) {
            wx.showToast({
              title: '家属信息有空',
              icon: 'none',
              duration: 2000
            });
            break;
            flag = false;
          }
        }
      }
    }
  }

})