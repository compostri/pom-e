import axios from 'axios'
import cookie from 'js-cookie'

const api = axios.create({
  baseURL: process.env.NEXT_STATIC_API_URL
})

api.interceptors.request.use(
  _config => {
    //Add token in headers
    const _token = cookie.get('token')
    if (_token) {
      _config.headers['Authorization'] = 'Bearer ' + _token
    }

    return _config
  },
  error => {
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
  getComposter = slug => this.get(`/composters/${slug}`)
  getComposterGeojson = () => this.get('/composters.geojson')
  getCommunes = () => this.get('/communes')
  getComposters = args => this.get('/composters', { params: args })
  getCategories = () => this.get('/categories')

  // User
  login = args => this.post('/login_check', args)
}

export default new MNApi()
