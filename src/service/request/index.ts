import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { HYRequestInterceptors, HYRequestConfig } from './type'
import { ElLoading, ILoadingInstance } from 'element-plus'

const DEFAULT_LOADING = true

class HYRequest {
  instance: AxiosInstance
  interceptors?: HYRequestInterceptors
  showLoading: boolean
  loading?: ILoadingInstance

  constructor(config: HYRequestConfig) {
    this.instance = axios.create(config)
    this.showLoading = config.showLoading ?? DEFAULT_LOADING
    this.interceptors = config.interceptors

    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )

    // 添加所有实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('所有实例都有的拦截器：请求成功1')
        this.loading = ElLoading.service({
          lock: true,
          text: '正在请求数据...',
          background: 'rgba(0, 0, 0, 0.5)'
        })
        return config
      },
      (err) => {
        console.log('所有实例都有的拦截器：请求失败1')
        return err
      }
    )

    this.instance.interceptors.response.use(
      (res) => {
        console.log('所有实例都有的拦截器：响应成功1')
        // 将loading移除
        this.loading?.close()

        const data = res.data
        if (data.returnCode === '1001') {
          console.log('请求失败，错误信息')
        } else {
          return data
        }
      },
      (err) => {
        // 将loading移除
        this.loading?.close()

        console.log('所有实例都有的拦截器：响应失败1')
        if (err.response.status === 404) {
          console.log('404的错误')
        }
        return err
      }
    )
  }

  request(config: HYRequestConfig) {
    if (config.interceptors?.requestInterceptor) {
      config = config.interceptors.requestInterceptor(config)
    }

    if (config.showLoading === false) {
      this.showLoading = config.showLoading
    }

    this.instance
      .request(config)
      .then((res) => {
        if (config.interceptors?.responseInterceptor) {
          res = config.interceptors.responseInterceptor(res)
        }

        console.log(res)

        this.showLoading = DEFAULT_LOADING
      })
      .catch((err) => {
        this.showLoading = DEFAULT_LOADING
        return err
      })
  }
}

export default HYRequest
