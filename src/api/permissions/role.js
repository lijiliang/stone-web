/*
 * @Author: Benson
 * @Date: 2019-01-10 17:42:08
 * @LastEditors: Benson
 * @LastEditTime: 2019-01-18 10:03:29
 * @Description: 角色管理 api
 */

import request from '@/utils/request'
import Urls from '../urls'

// 获取列表
export function getRolePagedList(query) {
  return request({
    url: `${Urls.role}`,
    method: 'get',
    params: query
  })
}

// 删除
export function delRole(id) {
  return request({
    url: `${Urls.role}/${id}`,
    method: 'delete'
  })
}

// 根据id获取
export function getRole(id) {
  return request({
    url: `${Urls.role}/${id}`,
    method: 'get'
  })
}

// 添加
export function addRole(data) {
  return request({
    url: `${Urls.role}`,
    method: 'post',
    data
  })
}

// 修改
export function putRole(id, data) {
  return request({
    url: `${Urls.role}/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除多个角色
 * @param {Object} data 敏感词ids {ids: '1,2,3'}
 */
export function deleteRoleeIds(data) {
  return request({
    url: `${Urls.role}`,
    method: 'delete',
    data
  })
}

// 保存角色与资源关联
export function savePermission(data) {
  return request({
    url: `${Urls.saveresources}`,
    method: 'post',
    data
  })
}

// 获取角色与资源关联列表
export function getRolePermissions(id) {
  return request({
    url: `${Urls.roleresources}/${id}`,
    method: 'get'
  })
}
