/*
 * @Author: Benson
 * @Date: 2019-02-18 16:05:04
 * @LastEditors: Benson
 * @LastEditTime: 2019-03-07 11:13:53
 * @Description: 栏目管理
 */

import request from '@/utils/request'
import Urls from '../urls'

// 获取列表
export function getCategoryList(query) {
  return request({
    url: `${Urls.cmsCategory}`,
    method: 'get',
    params: query
  })
}

// 删除
export function delCategory(id) {
  return request({
    url: `${Urls.cmsCategory}/${id}`,
    method: 'delete'
  })
}

// 根据id获取
export function getCategory(id) {
  return request({
    url: `${Urls.cmsCategory}/${id}`,
    method: 'get'
  })
}

// 添加
export function addCategory(data) {
  return request({
    url: `${Urls.cmsCategory}`,
    method: 'post',
    data
  })
}

// 修改
export function putCategory(id, data) {
  return request({
    url: `${Urls.cmsCategory}/${id}`,
    method: 'put',
    data
  })
}
