import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

// 导出的工具类
const utils = {
  // 判断值是否为空
  isEmpty: value => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === 'object' && Object.keys(value).length === 0) ||
      (typeof value === 'string' && (value.trim().length === 0 || value === '{}'))
    )
  },
  // 格式化时间戳
  formatDate: stamp => {
    if (stamp === 0) return 'Null'
    let now = new Date(stamp * 1000)
    let year = now.getFullYear()
    let month = now.getMonth() + 1
    let date = now.getDate()
    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()
    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
  },
  // 格式化用户级别
  formatUserLevel: level => {
    switch (true) {
      case level === 300:
        return '开发者'

      case level >= 200:
        return '超管理'

      case level >= 100:
        return '管理员'

      case level >= 30:
        return '珀金版'

      case level >= 20:
        return '黄金版'

      case level >= 10:
        return '青铜版'

      case level < 10:
        return '白嫖党'

      default:
        return 'Error'
    }
  },
  // 格式化卡密等级
  formatCardsLevel: level => {
    switch (level) {
      case 3:
        return '珀金版'
      case 2:
        return '黄金版'
      case 1:
        return '青铜版'
      default:
        return 'Error'
    }
  },
  // 格式化卡密时效
  formatCardsTime: timeLevel => {
    switch (timeLevel) {
      case 7:
        return '年卡'
      case 6:
        return '半年'
      case 5:
        return '季卡'
      case 4:
        return '月卡'
      case 3:
        return '周卡'
      case 2:
        return '天卡'
      case 1:
        return '时卡'
      default:
        return 'Error'
    }
  }
}

Vue.prototype.$utils = utils
Vue.use(VueClipboard)
export default utils
