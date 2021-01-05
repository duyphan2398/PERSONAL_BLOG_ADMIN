import axios from 'axios'
import store from '@/store'
import * as types from '@/store/mutation-types'
import router from '@/router'
import Cookie from 'js-cookie'

const instance = axios.create()
instance.defaults.baseURL = process.env.API_ENDPOINT
instance.defaults.headers.common['Accept'] = 'application/json'
instance.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
instance.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
instance.defaults.headers.common['Access-Control-Allow-Methods'] = '*'
instance.defaults.headers.common['Access-Control-Allow-Headers'] = '*'
// Interceptors
instance.interceptors.request.use(
  (config) => {
    if (Cookie.get('token')) {
      config.headers['Authorization'] = `Bearer ${Cookie.get('token')}`
      config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  }
)

instance.interceptors.response.use(response => response,
  async (error) => {
    // Do something with response error
    let { status } = error.response

    if (status === 401) {
      store.commit(types.LOG_OUT)
      await router.app.$notification.error(
        {
          message: router.app.$t('message_error'),
          description: error.response.data.message ? error.response.data.message : router.app.$t(`error_${status}_content`)
        }
      )
      if (store.state.layout !== 'auth') await router.push({ name: 'login' })
      return Promise.reject(error)
    }

    if ([403, 404, 429].includes(status)) {
      router.app.$notification.error(
        {
          message: router.app.$t('message_error'),
          description: router.app.$t(`error_${status}_content`)
        }
      )

      return Promise.reject(error)
    }

    if ([400].includes(status)) {
      router.app.$notification.error(
        {
          message: router.app.$t('message_error'),
          description: error.response.data.errors ? error.response.data.errors[0].message : router.app.$t(`error_${status}_content`)
        }
      )

      return Promise.reject(error)
    }

    // Redirect to Error Page
    const isRoute = router.resolve({ name: `error.${status}` })
    if (isRoute && isRoute.resolved.path !== '/') {
      await router.push({ name: `error.${status}` })
    }

    return Promise.reject(error)
  }
)

export default instance
