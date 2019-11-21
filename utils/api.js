import axios from 'axios'
import cookie from 'js-cookie'
import { isValid } from './auth'

const api = axios.create({
  baseURL: process.env.NEXT_STATIC_API_URL
})

api.interceptors.request.use(
  async config => {
    // Add token in headers
    const token = cookie.get('token')
    const refreshToken = cookie.get('refresh_token')

    if (token) {
      if (isValid(token)) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`
      } else {
        const res = await axios({
          baseURL: process.env.NEXT_STATIC_API_URL,
          headers: {
            'Cache-Control': 'no-cache'
          },
          url: 'api/token/refresh',
          timeout: 10000,
          method: 'post',
          data: {
            refresh_token: refreshToken
          }
        })
        if (res.data && res.data.token) {
          cookie.set('token', res.data.token, { expires: 1 })
          cookie.set('refresh_token', res.data.refresh_token, { expires: 1 })
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `Bearer ${res.data.token}`
        }
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

class MNApi {
  mnApi = api

  get = (path, data) => this.$send('get', path, data)

  post = (path, data) => this.$send('post', path, data)

  put = (path, data) => this.$send('put', path, data)

  delete = (path, data) => this.$send('delete', path, data)

  $send = (method, path, data) => {
    return this.mnApi[method](path, data)
  }

  // composters
  getComposters = args => this.get('/composters', { params: args })

  getComposter = slug => this.get(`/composters/${slug}`)
  getUserComposter = args => this.get(`/user_composters`, { params: args })
  updateComposter = (slug, args) => this.put(`/composters/${slug}`, args)
  updateUserComposter = (id, args) => this.put(id, args)
  getComposterGeojson = () => this.get('/composters.geojson')

  getCommunes = () => this.get('/communes')

  getCategories = () => this.get('/categories')

  // Media
  uploadMedia = formData => this.post('/media_objects', formData)

  removeMedia = id => this.delete(`/media_objects/${id}`)

  // User
  login = args => this.post('/login_check', args)

  getUsers = args => this.get('/users', { params: args })

  updateUser = (id, args) => this.put(`/users/${id}`, args)
}

export default new MNApi()
