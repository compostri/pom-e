import React, { useState } from 'react'
import { Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

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

const ComposterPermanences = ({ composter, users }) => {
  const classes = useStyles()

  const [date, setDate] = useState(today)

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
      <Calendar date={date} />
    </ComposterContainer>
  )
}

ComposterPermanences.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)
  const users = await api.getComposters()

  return {
    composter: composter.data,
    users: users.data
  }
}

export default ComposterPermanences
