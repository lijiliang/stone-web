import request from '@/utils/request'
import Urls from './urls'

/**
 * 获取所有用户
 * @param {Number} current 当前页
 * @param {Number} pageSize 每页多少条
 * @param {Number} userType 用户类型，1管理员，2普遍用户
 */
export function getUser(query) {
  // let _userType = ''
  // if (userType) {
  //   _userType = `&userType=${userType}`
  // }
  // return request({
  //   url: `${Urls.user}?current=${current}&pageSize=${pageSize}${_userType}`,
  //   method: 'get'
  // })

  return request({
    url: `${Urls.user}`,
    method: 'get',
    params: query
  })
}

/**
 * 删除单个用户
 * @param {String} userid 用户id
 */
export function deleteUser(userid) {
  return request({
    url: `${Urls.user}/${userid}`,
    method: 'delete'
  })
}

/**
 * 获取单个用户
 * @param {String} userid 用户id
 */
export function getUserid(userid) {
  return request({
    url: `${Urls.user}/${userid}`,
    method: 'get'
  })
}

/**
 * 创建用户
 */
export function postUser(data) {
  return request({
    url: `${Urls.user}`,
    method: 'post',
    data
  })
}

/**
 * 更新单个用户
 * @param {String} userid 用户id
 */
export function putUserid(userid, data) {
  return request({
    url: `${Urls.user}/${userid}`,
    method: 'put',
    data
  })
}
