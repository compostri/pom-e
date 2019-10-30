import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_STATIC_API_URL
})

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
}

export default new MNApi()
