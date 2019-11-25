import PropTypes from 'prop-types'

export const composterType = PropTypes.shape({
  rid: PropTypes.number,
  name: PropTypes.string,
  slug: PropTypes.string,
  commune: PropTypes.number,
  acceptNewMembers: PropTypes.boolean,
  image: PropTypes.shape({
    id: PropTypes.number.isRequired,
    contentUrl: PropTypes.string.isRequired
  })
})

export const permanenceType = PropTypes.shape({
  date: PropTypes.date,
  canceled: PropTypes.boolean,
  eventTitle: PropTypes.string,
  eventMessage: PropTypes.string,
  nbUsers: PropTypes.number,
  nbBuckets: PropTypes.number,
  temperature: PropTypes.number,
  openers: PropTypes.array
})

export const userType = PropTypes.shape({
  id: PropTypes.number,
  username: PropTypes.string,
  firstname: PropTypes.string,
  email: PropTypes.string
})
