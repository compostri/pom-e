import PropTypes from 'prop-types'

const composterType = PropTypes.shape({
  name: PropTypes.string,
  slug: PropTypes.string,
  image: PropTypes.string,
  commune: PropTypes.number,
  acceptNewMembers: PropTypes.boolean
})

export default composterType
