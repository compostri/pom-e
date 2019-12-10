import React from 'react'
import PropTypes from 'prop-types'
import { getCategoryColor } from '~/utils/utils'

const Marker = ({ color }) => {
  return (
    <svg viewBox="0 0 20 20" width="20" height="20">
      <circle fill={color} stroke="white" stroke-width="3" cx="10" cy="10" r="8.5" />
    </svg>
  )
}

Marker.defaultProps = {
  color: getCategoryColor()
}
Marker.propTypes = {
  color: PropTypes.string
}

export default Marker
