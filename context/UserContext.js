import React, { createContext, Component } from 'react'
import api from '../utils/api'
import cookie from 'js-cookie'
import { getUserInfosFromToken, isValid } from '../utils/auth'

export const UserContext = createContext({})

class UserProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      token: props.token || null,
      user: getUserInfosFromToken(props.token) || null,
      login: async values => {
        const res = await api.login(values)
        // On set les cookies
        if (res.data && res.data.token) {
          cookie.set('token', res.data.token, { expires: 1 })
          cookie.set('refresh_token', res.data.refresh_token, { expires: 1 })
          this.populateUser()
        }
        return res
      },
      logout: () => {
        this.setState({ token: null, user: {} })
        cookie.remove('token')
        cookie.remove('refresh_token')
      },
      isLoggedIn: () => {
        return !!this.state.token
      }
    }
  }

  populateUser = token => {
    const user = getUserInfosFromToken(token)
    this.setState({ user, token })
  }

  cookiechange = () => {
    const token = cookie.get('token')
    this.setState({ token, user: getUserInfosFromToken(token) })
  }

  componentDidMount = () => {
    this.populateUser(this.state.token)
    isValid(this.state.token)
    // listen to changes on cookie
    if (typeof browser !== 'undefined') {
      this.cookieListener = browser.cookies.onChanged.addListener(this.cookiechange)
    }
  }

  componentWillUnmount() {
    if (typeof browser !== 'undefined') {
      browser.cookies.onChanged.removeListener(this.cookieListener)
    }
  }

  render = () => <UserContext.Provider value={{ userContext: this.state }}>{this.props.children}</UserContext.Provider>
}

export const withUser = Component => props => <UserContext.Consumer>{store => <Component {...props} {...store} />}</UserContext.Consumer>

export default UserProvider
