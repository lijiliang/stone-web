/*
 * @Author: Benson
 * @Date: 2019-01-16 17:32:13
 * @LastEditors: Benson
 * @LastEditTime: 2019-01-16 17:34:31
 * @Description: 资源管理 API
 */

import request from '@/utils/request'
import Urls from '../urls'

// 获取列表
export function getResourceList(query) {
  return request({
    url: `${Urls.resource}`,
    method: 'get',
    params: query
  })
}

// 删除
export function delResource(id) {
  return request({
    url: `${Urls.resource}/${id}`,
    method: 'delete'
  })
}

// 根据id获取
export function getResource(id) {
  return request({
    url: `${Urls.resource}/${id}`,
    method: 'get'
  })
}

// 添加
export function addResource(data) {
  return request({
    url: `${Urls.resource}`,
    method: 'post',
    data
  })
}

// 修改
export function putResource(id, data) {
  return request({
    url: `${Urls.resource}/${id}`,
    method: 'put',
    data
  })
}
