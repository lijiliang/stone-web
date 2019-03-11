/*
 * @Author: Benson
 * @Date: 2019-02-18 16:05:04
 * @LastEditors: Benson
 * @LastEditTime: 2019-03-11 17:52:59
 * @Description: 文章管理
 */

import request from '@/utils/request'
import Urls from '../urls'

// 获取列表
export function getArticleList(query) {
  return request({
    url: `${Urls.cmsArticle}`,
    method: 'get',
    params: query
  })
}

// 删除
export function delArticle(id) {
  return request({
    url: `${Urls.cmsArticle}/${id}`,
    method: 'delete'
  })
}

// 根据id获取
export function getArticle(id) {
  return request({
    url: `${Urls.cmsArticle}/${id}`,
    method: 'get'
  })
}

// 添加
export function addArticle(data) {
  return request({
    url: `${Urls.cmsArticle}`,
    method: 'post',
    data
  })
}

// 修改
export function putArticle(id, data) {
  return request({
    url: `${Urls.cmsArticle}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除多个
 * @param {Object} data ids {ids: '1,2,3'}
 */
export function deleteArticleIds(data) {
  return request({
    url: `${Urls.cmsArticle}`,
    method: 'delete',
    data
  })
}
