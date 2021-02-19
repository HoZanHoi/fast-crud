import StringUtils from '../utils/util.string'
import dayjs from 'dayjs'
function doFormat (date, format) {
  if (StringUtils.isEmpty(date)) {
    return undefined
  }
  return dayjs(date).format(format)
}
function dateFormatter (value, format = 'YYYY-MM-DD HH:mm:ss') {
  if (value != null && value instanceof Array && value.length > 1) {
    if (StringUtils.hasEmpty(value)) {
      return undefined
    }
    return doFormat(value[0], format) + '至' + doFormat(value[1], format)
  }
  return doFormat(value, format)
}

function daterangeFormatter (row, column, value) {
  return dateFormatter(value, 'YYYY-MM-DD')
}
function datetimerangeFormatter (row, column, value) {
  return dateFormatter(value, 'YYYY-MM-DD HH:mm:ss')
}

const shortcuts = [{
  text: '最近一周',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近一个月',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    picker.$emit('pick', [start, end])
  }
}, {
  text: '最近三个月',
  onClick (picker) {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
    picker.$emit('pick', [start, end])
  }
}]

export {
  daterangeFormatter, datetimerangeFormatter, dateFormatter, doFormat, shortcuts
}
