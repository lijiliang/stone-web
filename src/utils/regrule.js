/**
 * 通用正则
 */

// 用户名不能以CN|cn开头
export const regUsername = /^(?!(cn|CN))[a-z0-9_-]*$/i

// 密码 -> 密码必须是数字和英文字母组合,必须有一个大写字母
export const regPassword = /^(?=.*[0-9].*)(?=.*[A-Z].*)[0-9a-zA-Z]{8,20}$/

// 手机号
export const regPhone = /^1[3|4|5|6|7|8|9][0-9]{9}$/ // /^1(3|4|5|7|8|9)\d{9}$/

// 电话号码
export const regTelPhone = /^0\d{2,3}-?\d{7,8}$/

// 邮箱
export const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

// 身份证
export const regIdCard = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/

// 中国邮政编码
export const regPostcode = /^[1-9]\d{5}$/

// 推荐人,安置人，不能为空
export const regReferenceId = /^((CN)?[0-9]+)?$/

// 推荐人,安置人，可以为空
export const regReferenceIdTrim = /^$|^((CN)?[0-9]+)?$/
