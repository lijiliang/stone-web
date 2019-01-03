import request from '@/utils/request'
import Urls from './urls'

// 获取登录日志
export function getLoginLogs(current = 1, pageSize = 10) {
  return request({
    url: `${Urls.logs}?current=${current}&pageSize=${pageSize}`,
    method: 'get'
  })
}
