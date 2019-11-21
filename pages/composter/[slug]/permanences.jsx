import React, { useState, useEffect } from 'react'
import { rrulestr } from 'rrule'
import { Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { composterType } from '~/types'
import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'
import palette from '~/variables'

import Calendar from '~/components/Calendar'

dayjs.locale('fr')

const useStyles = makeStyles(() => ({
  mois: {
    color: palette.greyDark,
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}))

const today = dayjs()

const ComposterPermanences = ({ composter }) => {
  const classes = useStyles()
  const [date, setDate] = useState(today)

  const startOfMonth = date.startOf('month')
  const endOfMonth = date.endOf('month')

  // ex: [12, 26, 28]
  const permanenceDates = rrulestr(composter.permanencesRule, { forceset: true })
    .between(startOfMonth.toDate(), endOfMonth.toDate())
    .map(d => dayjs(d).get('date'))

  useEffect(() => {
    const fetchPermanences = async () => {
      const before = endOfMonth.toISOString()
      const after = startOfMonth.toISOString()

      const t = await api.getPermanences({ composterId: composter.rid, before, after })
    }
    fetchPermanences()
  }, [composter.rid, startOfMonth, endOfMonth])

  const changeMonth = (action = 'add') => setDate(date[action](1, 'month'))

  const goOneMonthBack = () => {
    changeMonth('subtract')
  }
  const goOneMonthForward = () => {
    changeMonth('add')
  }

  return (
    <ComposterContainer composter={composter}>
      <div className={classes.nav}>
        <Button startIcon={<ChevronLeft onClick={goOneMonthBack} />} />
        <Typography variant="h1">
          <p className={classes.mois}>{date.format('MMMM YYYY')}</p>
        </Typography>
        <Button startIcon={<ChevronRight onClick={goOneMonthForward} />} />
      </div>
      <Calendar date={date} eventsDate={permanenceDates} />
    </ComposterContainer>
  )
}

ComposterPermanences.getInitialProps = async ({ query }) => {
  const { data: composter } = await api.getComposter(query.slug)

  return {
    composter
  }
}

ComposterPermanences.propTypes = {
  composter: composterType.isRequired
}

export default ComposterPermanences
