/*
 * @Author: Benson
 * @Date: 2019-01-15 18:01:20
 * @LastEditors: Benson
 * @LastEditTime: 2019-01-15 18:02:52
 * @Description: 角色与用户关联管理 api
 */

import request from '@/utils/request'
import Urls from '../urls'

// 添加
export function addRoleUser(data) {
  return request({
    url: `${Urls.roleuser}`,
    method: 'post',
    data
  })
}
