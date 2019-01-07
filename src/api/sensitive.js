import request from '@/utils/request'
import Urls from './urls'

/**
 * 获取敏感词类型列表
 */
export function getSensitivetype() {
  return request({
    url: `${Urls.sensitivetype}`,
    method: 'get'
  })
}

/**
 * 获取敏感词列表
 * @param {Number} current 当前页
 * @param {Number} pageSize 每页多少条
 */
export function getSensitive(current = 1, pageSize = 10) {
  return request({
    url: `${Urls.sensitive}?current=${current}&pageSize=${pageSize}`,
    method: 'get'
  })
}

/**
 * 根据id获取敏感词列表
 * @param {Number} id 当前页
 */
export function getSensitiveid(id) {
  return request({
    url: `${Urls.sensitive}/${id}`,
    method: 'get'
  })
}

/**
 * 创建敏感词
 */
export function postSensitive(data) {
  return request({
    url: `${Urls.sensitive}`,
    method: 'post',
    data
  })
}

/**
 * 删除单个敏感词
 * @param {String} id 敏感词id
 */
export function deleteSensitive(id) {
  return request({
    url: `${Urls.sensitive}/${id}`,
    method: 'delete'
  })
}

/**
 * 更新单个敏感词
 * @param {String} id 敏感词id
 */
export function putSensitiveid(id, data) {
  return request({
    url: `${Urls.sensitive}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新多个敏感词
 * @param {Object} data 敏感词ids {ids: '1,2,3'}
 */
export function deleteSensitiveIds(data) {
  return request({
    url: `${Urls.sensitive}`,
    method: 'delete',
    data
  })
}
