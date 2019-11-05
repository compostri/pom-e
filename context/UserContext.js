import React, { createContext, Component } from 'react'
import api from '../utils/api'
import cookie from 'js-cookie'
import jwt_decode from 'jwt-decode'

export const UserContext = createContext({})

class UserProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      token: props.token || null,
      user: {},
      login: async values => {
        const res = await api.login(values)
        // On set le cookie
        if (res.data && res.data.token) {
          cookie.set('token', res.data.token, { expires: 1 })
          this.populateUser()
        }
      },
      logout: () => {
        cookie.remove('token')
      },
      isLoggedIn: () => {
        return !!this.state.token
      }
    }
  }

  getUserInfosFromToken(tk) {
    const token = tk || cookie.get('token')
    if (token) {
      const { iat, exp, ...rest } = jwt_decode(token)
      return rest
    }
    return null
  }

  populateUser(token) {
    const user = this.getUserInfosFromToken(token)
    this.setState({ user, token })
  }

  componentDidMount() {
    this.populateUser(this.state.token)
  }

  render = () => <UserContext.Provider value={{ userContext: this.state }}>{this.props.children}</UserContext.Provider>
}

export const withUser = Component => props => <UserContext.Consumer>{store => <Component {...props} {...store} />}</UserContext.Consumer>

export default UserProvider
