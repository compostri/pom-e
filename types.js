import PropTypes from 'prop-types'

const composterType = PropTypes.shape({
  name: PropTypes.string,
  slug: PropTypes.string,
  commune: PropTypes.number,
  acceptNewMembers: PropTypes.boolean,
  image: PropTypes.shape({
    id: PropTypes.number.isRequired,
    contentUrl: PropTypes.string.isRequired
  })
})

export default composterType
