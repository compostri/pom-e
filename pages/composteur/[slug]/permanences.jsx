import React from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import Head from 'next/head'

import PermanencesProvider from '~/context/ComposterPermamencesContext'
import api from '~/utils/api'
import { composterType, permanenceType } from '~/types'
import ComposterPermanancesContainer from '~/containers/ComposterPermanancesContainer'
import ComposterContainer from '~/components/ComposterContainer'
import { withAccessAbility, Subject } from '~/context/AbilityContext'

const ComposterPermanences = ({ composter, permanences }) => {
  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>Les permanences de {composter.name} - un composteur géré par Compostri</title>
      </Head>
      <PermanencesProvider permanences={permanences} composterId={composter.rid} composterAtId={composter['@id']}>
        <ComposterPermanancesContainer permanencesRule={composter.permanencesRule} />
      </PermanencesProvider>
    </ComposterContainer>
  )
}

const getRedirectUrl = ({ asPath }) => {
  return asPath.replace('/permanences', '')
}

const getInitialProps = async ({ query }) => {
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

ComposterPermanences.getInitialProps = withAccessAbility(
  ({ composter: { permanencesRule } }) => ({ $type: Subject.COMPOSTER_PERMANENCES, permanencesRule }),
  getRedirectUrl
)(getInitialProps)

ComposterPermanences.propTypes = {
  composter: composterType.isRequired,
  permanences: PropTypes.arrayOf(permanenceType).isRequired
}

export default ComposterPermanences
