/*
 * @Author: Benson
 * @Date: 2019-02-18 16:05:04
 * @LastEditors: Benson
 * @LastEditTime: 2019-03-22 16:38:27
 * @Description: 推荐位管理
 */

import request from '@/utils/request'
import Urls from '../urls'

// 获取列表
export function getList(query) {
  return request({
    url: `${Urls.cmsRecommend}`,
    method: 'get',
    params: query
  })
}

// 删除
export function del(id) {
  return request({
    url: `${Urls.cmsRecommend}/${id}`,
    method: 'delete'
  })
}

// 根据id获取
export function get(id) {
  return request({
    url: `${Urls.cmsRecommend}/${id}`,
    method: 'get'
  })
}

// 添加
export function add(data) {
  return request({
    url: `${Urls.cmsRecommend}`,
    method: 'post',
    data
  })
}

// 修改
export function put(id, data) {
  return request({
    url: `${Urls.cmsRecommend}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除多个
 * @param {Object} data ids {ids: '1,2,3'}
 */
export function deleteIds(data) {
  return request({
    url: `${Urls.cmsRecommend}`,
    method: 'delete',
    data
  })
}
