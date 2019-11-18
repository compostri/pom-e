import axios from 'axios'
import cookie from 'js-cookie'
import { isValid } from './auth'

const api = axios.create({
  baseURL: process.env.NEXT_STATIC_API_URL
})

api.interceptors.request.use(
  async (_config) => {
    //Add token in headers
    const _token = cookie.get('token')
    const refresh_token = cookie.get('refresh_token')

    if (_token) {
      if (isValid(_token)) {
        _config.headers['Authorization'] = 'Bearer ' + _token
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
            refresh_token: refresh_token
          }
        })
        if (res.data && res.data.token) {
          cookie.set('token', res.data.token, { expires: 1 })
          cookie.set('refresh_token', res.data.refresh_token, { expires: 1 })
          _config.headers['Authorization'] = 'Bearer ' + res.data.token
        }
      }
    }

    return _config
  },
  (error) => {
    return Promise.reject(error)
  }
)

class MNApi {
  constructor() {
    this.api = api
  }

  get = (path, data) => this._send('get', path, data)
  post = (path, data) => this._send('post', path, data)
  put = (path, data) => this._send('put', path, data)
  delete = (path, data) => this._send('delete', path, data)

  _send = (method, path, data) => {
    // const token = window.localStorage.getItem('token')
    // if (token) {
    //   this.api.setHeader('Authorization', `Bearer ${token}`)
    // }
    return this.api[method](path, data)
  }

  // composters
  getComposters = args => this.get('/composters', { params: args })
  getComposter = slug => this.get(`/composters/${slug}`)
  updateComposter = (slug, args) => this.put(`/composters/${slug}`, args)
  getComposterGeojson = () => this.get('/composters.geojson')

  getCommunes = () => this.get('/communes')
  getCategories = () => this.get('/categories')

  // User
  login = args => this.post('/login_check', args)
  getUsers = args => this.get('/users', { params: args })
  updateUser = (id, args) => this.put(`/users/${id}`, args)
}

export default new MNApi()
