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

  $withPromiseHandling = async (apiCall, ...params) => {
    const errorMessage = 'Une erreur est survenue'
    const { status, data } = await apiCall(...params)

    if (status < 300) {
      return data || 'success'
    }
    throw errorMessage
  }

  // composters
  getComposters = args => this.get('/composters', { params: args })

  getComposter = slug => this.get(`/composters/${slug}`)

  getUserComposter = args => this.$withPromiseHandling(this.get, `/user_composters`, { params: args })

  updateComposter = (slug, args) => this.$withPromiseHandling(this.put, `/composters/${slug}`, args)

  createUserComposter = args => this.post(`/user_composters`, args)

  updateUserComposter = (id, args) => this.put(id, args)

  getComposterGeojson = () => this.get('/composters.geojson')

  sendComposterContact = args => this.post('composter_contacts', args)

  getCommunes = args => this.get('/communes', { params: args })

  getCategories = () => this.get('/categories')

  deleteUserComposter = id => this.delete(id)

  // Permanences

  getPermanences = ({ composterId: composter, before, after }) =>
    this.$withPromiseHandling(this.get, '/permanences', { params: { composter, 'date[before]': before, 'date[after]': after } })

  putPermanences = (permanenceId, args) => this.$withPromiseHandling(this.put, `/permanences/${permanenceId}`, args)

  postPermanences = ({ date, openers, composter }) => this.$withPromiseHandling(this.post, '/permanences', { date, openers, composter })

  // Newsletter

  getConsumers = params => this.$withPromiseHandling(this.get, '/consumers', { params })

  postConsumers = ({ username, email, composterId, subscribeToCompostriNewsletter }) =>
    this.$withPromiseHandling(this.post, '/consumers', { username, email, composters: [composterId], subscribeToCompostriNewsletter })

  sendComposterNewsletter = values => this.post('/composter_newsletters', values)

  // Media
  uploadMedia = formData => this.$withPromiseHandling(this.post, '/media_objects', formData)

  removeMedia = id => this.$withPromiseHandling(this.delete, `/media_objects/${id}`)

  // User
  login = args => this.post('/login_check', args)

  getUsers = args => this.get('/users', { params: args })

  updateUser = (id, args) => this.put(`/users/${id}`, args)

  validate = args => this.post('/user_password_changes', args)

  reinit = args => this.post('/user_password_recoveries', args)
}

export default new MNApi()
