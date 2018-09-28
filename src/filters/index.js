import i18n from '@/plugins/i18n'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime)
export default {
  filters: {
    formatDate (val) {
      if (!val) { return '-' }
      let date = val.toDate()
      return dayjs(date).locale(i18n.locale).fromNow()
    },
    trimLength (val) {
      if (val.length < 200) {
        return val
      }
      return `${val.substring(0, 200)}...`
    },
    formatNumber (val) {
      return val.toFixed(2)
    }
  }
}
