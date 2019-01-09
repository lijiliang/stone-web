/*
 * @Author: Benson
 * @Date: 2019-01-08 18:17:31
 * @LastEditors: Benson
 * @LastEditTime: 2019-01-09 15:38:24
 * @Description: 接口管理 api
 */

import request from '@/utils/request'
import Urls from './urls'

// 获取列表
export function getInterfacePagedList(query) {
  return request({
    url: `${Urls.interface}`,
    method: 'get',
    params: query
  })
}

// 删除
export function delInterface(id) {
  return request({
    url: `${Urls.interface}/${id}`,
    method: 'delete'
  })
}

// 根据id获取
export function getInterface(id) {
  return request({
    url: `${Urls.interface}/${id}`,
    method: 'get'
  })
}

// 添加
export function addInterface(data) {
  return request({
    url: `${Urls.interface}`,
    method: 'post',
    data
  })
}

// 修改
export function putInterface(id, data) {
  return request({
    url: `${Urls.interface}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除多个敏感词
 * @param {Object} data 敏感词ids {ids: '1,2,3'}
 */
export function deleteInterfaceeIds(data) {
  return request({
    url: `${Urls.interface}`,
    method: 'delete',
    data
  })
}
