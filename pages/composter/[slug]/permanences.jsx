import React from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'

import PermanencesProvider from '~/context/ComposterPermamencesContext'
import api from '~/utils/api'
import { composterType, permanenceType } from '~/types'
import ComposterPermanancesContainer from '~/containers/ComposterPermanancesContainer'
import ComposterContainer from '~/components/ComposterContainer'

const ComposterPermanences = ({ composter, permanences }) => {
  return (
    <ComposterContainer composter={composter}>
      <PermanencesProvider permanences={permanences} composterId={composter.rid} composterAtId={composter['@id']}>
        <ComposterPermanancesContainer permanencesRule={composter.permanencesRule} />
      </PermanencesProvider>
    </ComposterContainer>
  )
}

ComposterPermanences.getInitialProps = async ({ query }) => {
  const today = dayjs()

  const [after, before] = ['startOf', 'endOf'].map(method => today[method]('month').toISOString())

  const { data: composter } = await api.getComposter(query.slug)
  const data = await api.getPermanences({ composterId: composter.rid, before, after })

  return {
    composter,
    slug: query.slug,
    permanences: data['hydra:member']
  }
}

ComposterPermanences.propTypes = {
  composter: composterType.isRequired,
  permanences: PropTypes.arrayOf(permanenceType).isRequired
}

export default ComposterPermanences
