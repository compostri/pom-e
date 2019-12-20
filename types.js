import PropTypes from 'prop-types'

export const composterType = PropTypes.shape({
  rid: PropTypes.number,
  name: PropTypes.string,
  slug: PropTypes.string,
  commune: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
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

export const consumerType = PropTypes.shape({
  '@id': PropTypes.string,
  '@type': PropTypes.string,
  composters: PropTypes.arrayOf(PropTypes.string),
  email: PropTypes.string,
  id: PropTypes.number,
  mailjetContactsLists: PropTypes.arrayOf(
    PropTypes.shape({
      IsActive: PropTypes.bool,
      IsUnsub: PropTypes.bool,
      ListID: PropTypes.number,
      SubscribedAt: PropTypes.string
    })
  ),
  mailjetId: PropTypes.number,
  username: PropTypes.string
})

export const communeType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string
})

export const categorieType = PropTypes.shape({
  id: PropTypes.number,
  name: PropTypes.string
})

export const mediaObjectType = PropTypes.shape({
  id: PropTypes.number,
  updatedAt: PropTypes.string,
  imageName: PropTypes.string,
  imageSize: PropTypes.number,
  imageMimeType: PropTypes.string,
  contentUrl: PropTypes.string
})
