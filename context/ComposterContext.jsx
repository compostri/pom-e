import React, { createContext, Component } from 'react'

export const ComposterContext = createContext({})

class ComposterProvider extends Component {
  constructor(props) {
    super(props)
    this.state = {
      composter: props.composter || null,
      setComposter: composter => {
        this.setState(state => {
          return { composter: composter }
        })
      }
    }
  }

  render() {
    return <ComposterContext.Provider value={{ composterContext: this.state }}>{this.props.children}</ComposterContext.Provider>
  }
}

export const withComposter = Component => props => <ComposterContext.Consumer>{store => <Component {...props} {...store} />}</ComposterContext.Consumer>

export default ComposterProvider
