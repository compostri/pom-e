import React, { createContext, useState, useReducer } from 'react'
import PropTypes from 'prop-types'

import { permanenceType } from '~/types'
import api from '~/utils/api'
import { useToasts, TOAST } from '~/components/Snackbar'

const $id = perm => perm['@id']

const type = {
  UPDATE_PERMANENCES_REQUEST: 'UPDATE_PERMANENCES_REQUEST',
  UPDATE_PERMANENCES_SUCCESS: 'UPDATE_PERMANENCES_SUCCESS',
  UPDATE_PERMANENCES_FAILURE: 'UPDATE_PERMANENCES_FAILURE'
}

const usePermanencesAction = dispatch => {
  return {
    request: () => dispatch({ type: type.UPDATE_PERMANENCES_REQUEST }),
    success: data => dispatch({ type: type.UPDATE_PERMANENCES_SUCCESS, payload: data }),
    failure: () => dispatch({ type: type.UPDATE_PERMANENCES_FAILURE })
  }
}

const permanencesInitialState = {
  data: null,
  fetching: true
}

const permanencesReducer = (state, action) => {
  switch (action.type) {
    case type.UPDATE_PERMANENCES_REQUEST:
      return {
        ...state,
        fetching: true
      }
    case type.UPDATE_PERMANENCES_SUCCESS:
      return {
        data: action.payload,
        fetching: false
      }
    case type.UPDATE_PERMANENCES_FAILURE:
      return {
        ...state,
        fetching: true
      }

    default:
      return state
  }
}

export const PermanencesContext = createContext({})

const propTypes = {
  permanences: permanenceType,
  children: PropTypes.node.isRequired
}
const defaultProps = {
  permanences: null
}

const PermanencesProvider = ({ children, permanences: defaultPermanences }) => {
  const { addToast } = useToasts()

  const [permanences, dispatch] = useReducer(permanencesReducer, { ...permanencesInitialState, data: defaultPermanences })
  const permanencesAction = usePermanencesAction(dispatch)

  const [permanenceDetails, setPermanenceDetails] = useState(null)

  const $displayErrorFromApi = () => {
    addToast('Une erreur a eu lieu', TOAST.ERROR)
  }

  const $displaySuccessFromApi = () => {
    addToast('Votre demande a bien été prise en compte !', TOAST.SUCCESS)
  }

  const updateOpeners = async newOpeners => {
    const permanenceDetailsId = $id(permanenceDetails)
    const data = await api.putPermanences(permanenceDetailsId, { openers: newOpeners }).catch($displayErrorFromApi)

    if (data) {
      setPermanenceDetails({ ...permanenceDetails, openers: data.openers })
      $displaySuccessFromApi()
    }
  }

  const addOpeners = async (newOpeners, composterId) => {
    const data = await api.postPermanences({ openers: newOpeners, composter: composterId, date: permanenceDetails.date })

    if (data) {
      setPermanenceDetails({ ...permanenceDetails, openers: data.openers })
      $displaySuccessFromApi()
    }
  }

  const addPermanenceDetails = ({ anchorEl, vPos, hPos, ...permDetails }) => {
    setPermanenceDetails({ anchorEl, vPos, hPos, ...permDetails })
  }

  const removePermanenceDetails = () => {
    setPermanenceDetails(null)
  }

  const updatePermanencesDate = async ({ composterId, before, after }) => {
    const { request, success, failure } = permanencesAction
    request()
    const data = await api.getPermanences({ composterId, before, after }).catch($displayErrorFromApi)
    if (data) {
      success(data['hydra:member'])
    } else {
      failure()
    }
  }

  const state = {
    permanences,
    permanenceDetails,
    updateOpeners,
    addOpeners,
    addPermanenceDetails,
    removePermanenceDetails,
    updatePermanencesDate
  }

  return <PermanencesContext.Provider value={state}>{children}</PermanencesContext.Provider>
}

PermanencesProvider.propTypes = propTypes
PermanencesProvider.defaultProps = defaultProps
export default PermanencesProvider
