import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import qs from 'qs'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 5000, // request timeout
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded'
    'Content-Type': 'application/json'
  },
  withCredentials: true // 允许携带cookie
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // if (config.method === 'post') {
  //   config.data = qs.stringify(config.data)
  // }
  if (config.method === 'put') {
    config.headers['Content-Type'] = 'application/json'
    // config.headers['X-Requested-With'] = 'XMLHttpRequest'
    // config.headers['Accept'] = '*/*'
  }
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['X-Token'] = getToken()
    config.headers['Authorization'] = `Bearer ${getToken()}`
  }
  return config
}, error => {
  // Do something with request error
  console.log('err' + error) // for debug
  Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // const status = response.status // 返回的状态码
    // if (status !== 200) {
    //   if (status === 0) {
    //     Message({
    //       message: '服务器连接失败！',
    //       type: 'error',
    //       duration: 5 * 1000
    //     })
    //   }
    //   return Promise.reject('error')
    // } else {
    //   return res
    // }
    return res
  },
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  // response => {
  //   const res = response.data
  //   if (res.code !== 20000) {
  //     Message({
  //       message: res.message,
  //       type: 'error',
  //       duration: 5 * 1000
  //     })
  //     // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //     if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //       // 请自行在引入 MessageBox
  //       // import { Message, MessageBox } from 'element-ui'
  //       MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //         confirmButtonText: '重新登录',
  //         cancelButtonText: '取消',
  //         type: 'warning'
  //       }).then(() => {
  //         store.dispatch('FedLogOut').then(() => {
  //           location.reload() // 为了重新实例化vue-router对象 避免bug
  //         })
  //       })
  //     }
  //     return Promise.reject('error')
  //   } else {
  //     return response.data
  //   }
  // },
  error => {
    // console.log('err' + error) // for debug

    const response = error.response
    const _status = response.status
    if (_status === 401) {
      // 会话已过期
      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
      return
    }
    if (_status === 400 || _status === 422) {
      if (!response.data.success) {
        Message({
          message: response.data.message,
          type: 'error',
          duration: 5 * 1000
        })
        return
      }
    }
    console.log('err: ' + error, error.response)// for debug
    if (error.response && error.response.data.message === 'Bad credentials') {
      Message({
        message: '用户名或密码错误',
        type: 'error',
        duration: 5 * 1000
      })
    } else if (response) {
      MessageBox.alert(`
        <div class="message-err">
        <p>错误代码：${response.status}</p>
        <p>错误提示：${response.data.message ? response.data.message : response.statusText}</p>
        <p>请求路径：${response.config.url}</p>
        <p>请截图告知管理员</p></div>
      `, '服务器碰到错误', {
        dangerouslyUseHTMLString: true,
        customClass: 'messagebox-error-tip'
      })
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
