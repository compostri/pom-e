import React, { createContext, useReducer } from 'react'
import PropTypes from 'prop-types'

import { permanenceType } from '~/types'
import api from '~/utils/api'
import { useToasts, TOAST } from '~/components/Snackbar'

/* Type */

const type = {
  UPDATE_PERMANENCES_REQUEST: 'UPDATE_PERMANENCES_REQUEST',
  UPDATE_PERMANENCES_SUCCESS: 'UPDATE_PERMANENCES_SUCCESS',
  UPDATE_PERMANENCES_FAILURE: 'UPDATE_PERMANENCES_FAILURE',

  GET_PERMANENCE_DETAILS_REQUEST: 'GET_PERMANENCE_DETAILS_REQUEST',
  GET_PERMANENCE_DETAILS_SUCCESS: 'GET_PERMANENCE_DETAILS_SUCCESS',
  GET_PERMANENCE_DETAILS_FAILURE: 'GET_PERMANENCE_DETAILS_FAILURE',

  RESET_PERMANENCE_DETAILS: 'RESET_PERMANENCE_DETAILS'
}

/* Action  Creators */

const usePermanencesAction = dispatch => {
  return {
    request: () => dispatch({ type: type.UPDATE_PERMANENCES_REQUEST }),
    success: data => dispatch({ type: type.UPDATE_PERMANENCES_SUCCESS, payload: data }),
    failure: () => dispatch({ type: type.UPDATE_PERMANENCES_FAILURE })
  }
}

const usePermanenceDetailsAction = dispatch => {
  return {
    request: () => dispatch({ type: type.GET_PERMANENCE_DETAILS_REQUEST }),
    success: data => dispatch({ type: type.GET_PERMANENCE_DETAILS_SUCCESS, payload: data }),
    failure: () => dispatch({ type: type.GET_PERMANENCE_DETAILS_FAILURE }),
    reset: () => dispatch({ type: type.RESET_PERMANENCE_DETAILS })
  }
}

/* Init State */

const INITIAL_STATE = {
  collection: {
    data: [],
    fetching: false
  },
  details: {
    data: null,
    fetching: false
  }
}

const reducer = (state, action) => {
  switch (action.type) {
    case type.UPDATE_PERMANENCES_REQUEST:
      return {
        ...state,
        collection: {
          data: [],
          fetching: true
        }
      }
    case type.UPDATE_PERMANENCES_SUCCESS:
      return {
        ...state,
        collection: {
          data: action.payload,
          fetching: false
        }
      }
    case type.UPDATE_PERMANENCES_FAILURE:
      return {
        ...state,
        collection: {
          data: state.collection.data,
          fetching: false
        }
      }

    case type.GET_PERMANENCE_DETAILS_REQUEST:
      return {
        ...state,
        details: {
          data: state.details.data,
          fetching: true
        }
      }
    case type.GET_PERMANENCE_DETAILS_SUCCESS:
      return {
        ...state,
        details: {
          data: action.payload,
          fetching: false
        }
      }
    case type.GET_PERMANENCE_DETAILS_FAILURE:
      return {
        ...state,
        details: {
          data: state.details.data,
          fetching: false
        }
      }
    case type.RESET_PERMANENCE_DETAILS:
      return {
        ...state,
        details: {
          data: null,
          fetching: false
        }
      }

    default:
      return state
  }
}

const usePermanencesSelector = state => state.collection.data
const usePermanenceDetailSelector = state => state.details.data

const ComposterPermanencesContext = createContext({})

const propTypes = {
  permanences: PropTypes.arrayOf(permanenceType),
  composterId: PropTypes.number.isRequired,
  composterAtId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}
const defaultProps = {
  permanences: null
}

const ComposterPermanencesProvider = ({ children, composterId, composterAtId, permanences: defaultPermanences }) => {
  const { addToast } = useToasts()

  const [state, dispatch] = useReducer(reducer, { ...INITIAL_STATE, collection: { ...INITIAL_STATE.collection, data: defaultPermanences } })

  const permanences = usePermanencesSelector(state)
  const permanenceDetails = usePermanenceDetailSelector(state)

  const permanencesAction = usePermanencesAction(dispatch)
  const permanenceDetailsAction = usePermanenceDetailsAction(dispatch)

  const $displayErrorFromApi = () => {
    addToast('Une erreur a eu lieu', TOAST.ERROR)
  }

  const $displaySuccessFromApi = () => {
    addToast('Votre demande a bien été prise en compte !', TOAST.SUCCESS)
  }

  const $removeDuplicate = (items, { by }) => {
    const getKey = item => item[by]
    const byUniqKey = (itemList, item) => {
      if (!itemList.length) {
        return [item]
      }
      return itemList.map(getKey).includes(getKey(item)) ? itemList : [...itemList, item]
    }
    return items.reduce(byUniqKey, [])
  }

  const updatePermanenceDetails = async payload => {
    permanenceDetailsAction.request()
    const permanenceDetailsId = permanenceDetails.id

    const permanence = await (permanenceDetailsId
      ? api.putPermanences(permanenceDetailsId, payload)
      : api.postPermanences({ composter: composterAtId, ...payload, date: permanenceDetails.$date })
    ).catch($displayErrorFromApi)

    if (permanence) {
      const isPermanenceHasbeenCreated = permanences.map(({ id }) => id).includes(permanence.id)

      const updatedPermanences = isPermanenceHasbeenCreated
        ? permanences.reduce((acc, curr) => [...acc, curr.id === permanence.id ? permanence : curr], [])
        : [...permanences, permanence]

      permanencesAction.success(updatedPermanences)

      permanenceDetailsAction.success({
        ...permanenceDetails,
        ...permanence,
        $openersAvailable: $removeDuplicate(permanenceDetails.$openersAvailable, { by: '@id' })
      })
      $displaySuccessFromApi()
    } else {
      permanenceDetailsAction.failure()
      $displayErrorFromApi()
    }
  }

  const removePermanenceDetails = () => {
    permanenceDetailsAction.reset()
  }

  const addPermanenceDetails = async (permanence, { $popover, $date }) => {
    permanenceDetailsAction.request()

    const data = await api.getUserComposter({ composter: composterId }).catch($displayErrorFromApi)
    if (data) {
      const composterOpeners = data['hydra:member'].map(({ user }) => user)
      const $openersAvailable = $removeDuplicate([...permanence.openers, ...composterOpeners], { by: '@id' })

      permanenceDetailsAction.success({ ...permanence, $popover, $openersAvailable, $date })
    } else {
      $displayErrorFromApi()
    }
  }

  const retrievePermanences = async ({ before, after }) => {
    permanencesAction.request()
    addToast('Chargement des permanences', TOAST.INFO)
    const data = await api.getPermanences({ composterId, before, after }).catch($displayErrorFromApi)
    if (data) {
      permanencesAction.success(data['hydra:member'])
    } else {
      permanencesAction.failure()
    }
  }

  const value = {
    permanences: state.collection,
    permanenceDetails: state.details,
    addPermanenceDetails,
    removePermanenceDetails,
    updatePermanenceDetails,
    retrievePermanences
  }

  return <ComposterPermanencesContext.Provider value={value}>{children}</ComposterPermanencesContext.Provider>
}

ComposterPermanencesProvider.propTypes = propTypes
ComposterPermanencesProvider.defaultProps = defaultProps
export { ComposterPermanencesContext }
export default ComposterPermanencesProvider
