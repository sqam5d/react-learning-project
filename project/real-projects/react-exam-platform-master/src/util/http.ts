import axios from 'axios'
import eventBus from './event'
// 定义一个缓存池用来缓存数据
let cache = {}
const EXPIRE_TIME = 6000
// 利用axios的cancelToken来取消请求
const CancelToken = axios.CancelToken

const instance = axios.create({
  validateStatus: function (status) {
    return status < 500 // 处理状态码小于500的情况
  }
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config: any) {
    // 如果需要缓存--考虑到并不是所有接口都需要缓存的情况
    if (config.cache) {
      let source = CancelToken.source()
      config.cancelToken = source.token
      // 去缓存池获取缓存数据
      //@ts-ignore
      let data = cache[config.url]
      // 获取当前时间戳
      let expire_time = getExpireTime()
      // 判断缓存池中是否存在已有数据 存在的话 再判断是否过期
      // 未过期 source.cancel会取消当前的请求 并将内容返回到拦截器的err中
      if (data && expire_time - data.expire < EXPIRE_TIME) {
        source.cancel(data)
      }
    }
    // 在发送请求之前做些什么
    return config
  },
  function (err) {
    // 对请求错误做些什么
    return Promise.reject(err)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  function (response: any) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    // 只缓存get请求
    if (response.config.method === 'get') {
      // 缓存数据 并将当前时间存入 方便之后判断是否过期
      let data = {
        expire: getExpireTime(),
        data: response.data
      }
      // @ts-ignore
      cache[`${response.config.url}`] = data
    }

    console.log('响应状态码', response.status)

    if (response.status === 200) {
      // 401未登录
      if (response.data.code === 401) {
        eventBus.emit('global_not_login', response.data.msg)
      }

      // 业务错误
      if (response.data.code === -1) {
        eventBus.emit('global_error_tips', response.data.msg)
      }
    } else if (response.status === 403) {
      eventBus.emit('global_error_auth', '没有权限，爬一边去')
    }

    return response
  },
  function (err: any) {
    if (axios.isCancel(err)) {
      // console.log(err.message, 2222222222222222)
      //@ts-ignore
      return Promise.resolve(err.message)
    }
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // console.log('响应拦截器中的失败响应', err.response.status)
    eventBus.emit('global_error_tips', err.response.data.msg)

    return Promise.reject(err)
  }
)

// 获取当前时间
function getExpireTime() {
  return new Date().getTime()
}
// 定义axios的类型
export type AxiosRes<T = ResData> = {
  config: Object
  data: T
  headers: any
  request: any
  status: number
  statusText: string
}

// 定义axios中data的数据类型
export type ResData<T = any> = {
  code: number
  msg: string
  data: T
  count?: number
}

export type AxiosResData<T = any> = AxiosRes<ResData<T>>

export default instance
