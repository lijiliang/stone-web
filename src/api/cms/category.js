/*
 * @Author: Benson
 * @Date: 2019-02-18 16:05:04
 * @LastEditors: Benson
 * @LastEditTime: 2019-02-18 16:06:19
 * @Description: 栏目管理
 */

import request from '@/utils/request'
import Urls from '../urls'

// 获取列表
export function getCategoryList(query) {
  return request({
    url: `${Urls.category}`,
    method: 'get',
    params: query
  })
}

// 删除
export function delCategory(id) {
  return request({
    url: `${Urls.category}/${id}`,
    method: 'delete'
  })
}

// 根据id获取
export function getCategory(id) {
  return request({
    url: `${Urls.category}/${id}`,
    method: 'get'
  })
}

// 添加
export function addCategory(data) {
  return request({
    url: `${Urls.category}`,
    method: 'post',
    data
  })
}

// 修改
export function putCategory(id, data) {
  return request({
    url: `${Urls.category}/${id}`,
    method: 'put',
    data
  })
}
