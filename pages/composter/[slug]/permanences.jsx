import React from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import PermanencesProvider from '~/context/ComposterPermamencesContext'
import api from '~/utils/api'
import { composterType, permanenceType } from '~/types'
import ComposterPermanancesContainer from '~/containers/ComposterPermanancesContainer'

const ComposterPermanences = ({ composter, permanences }) => {
  return (
    <PermanencesProvider permanences={permanences} composterId={composter.rid} composterAtId={composter['@id']}>
      <ComposterPermanancesContainer composter={composter} />
    </PermanencesProvider>
  )
}

ComposterPermanences.getInitialProps = async ({ query }) => {
  const today = dayjs()

  const [after, before] = ['startOf', 'endOf'].map(method => today[method]('month').toISOString())

  const { data: composter } = await api.getComposter(query.slug)
  const data = await api.getPermanences({ composterId: composter.rid, before, after })

  return {
    composter,
    permanences: data['hydra:member']
  }
}

ComposterPermanences.propTypes = {
  composter: composterType.isRequired,
  permanences: PropTypes.arrayOf(permanenceType).isRequired
}

export default ComposterPermanences
