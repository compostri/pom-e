import React, { createContext } from 'react'
import PropTypes from 'prop-types'
import { composterType } from '~/types'

export const ComposterContext = createContext({})

const propTypes = { composter: composterType.isRequired, children: PropTypes.node.isRequired }

const ComposterProvider = ({ composter, children }) => {
  return <ComposterContext.Provider value={{ composterContext: { composter } }}>{children}</ComposterContext.Provider>
}

ComposterProvider.propTypes = propTypes

export const withComposter = Component => props => <ComposterContext.Consumer>{store => <Component {...props} {...store} />}</ComposterContext.Consumer>

export default ComposterProvider
