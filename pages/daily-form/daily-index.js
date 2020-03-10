import { getReport } from '../../api/service/report';
import dayjs from 'dayjs';

Component({
  properties: {
    groupId: {
      type: Number,
    },
    role: {
      type: String,
    },
    hasSubmit: {
      type: Boolean,
    },
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    newTime: {
      type: String,
    },
  },

  lifetimes: {
    ready: function() {
      getReport(this.data.groupId).then(res => {
        const app = getApp();
        const time = dayjs();
        const days = ['日', '一', '二', '三', '四', '五', '六'];

        let hasSubmit = false;
        if (res.data.length &&
            dayjs(res.data[0].createdAt).isSame(dayjs(), 'date')) {
          hasSubmit = true;
        }
        this.setData({
          name: app.globalData.name,
          phone: app.globalData.phone,
          hasSubmit,
          newTime: `${time.format('YYYY年MM月DD日')} 星期${days[time.day()]} ${time.format('HH:mm')}`
        });
      });
    }
  }
});
