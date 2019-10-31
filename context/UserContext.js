import React, { createContext, Component } from 'react'

export const UserContext = createContext({})

class UserProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false,
      user: {},
      isLoggedIn: () => {
        return false
      }
    }
  }

  render = () => <UserContext.Provider value={{ userContext: this.state }}>{this.props.children}</UserContext.Provider>
}

export const withUser = Component => props => <UserContext.Consumer>{store => <Component {...props} {...store} />}</UserContext.Consumer>

export default UserProvider
