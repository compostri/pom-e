import React, { useState, useEffect, useMemo, useRef, Fragment, useContext } from 'react'
import { rrulestr } from 'rrule'
import { Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { composterType, permanenceType } from '~/types'
import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'
import PermanceCard from '~/components/PermanenceCard'
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

const getDayInMonth = date => dayjs(date).get('date')
const getDayInMonthFromPermanence = ({ date }) => getDayInMonth(date)
const renderWithKey = renderFn => (data, i) => {
  const key = `permanence-${data.date}-${i}`
  return <Fragment key={key}>{renderFn(data)}</Fragment>
}

const ComposterPermanences = ({ perms, composter }) => {
  const classes = useStyles()

  const isInitialMount = useRef(true)

  const [date, setDate] = useState(today)
  const [permanences, setPermanences] = useState(perms)

  const startOfMonth = useMemo(() => date.startOf('month'), [date])
  const endOfMonth = useMemo(() => date.endOf('month'), [date])

  // ex: [12, 26, 28]
  const rulesDates = rrulestr(composter.permanencesRule, { forceset: true })
    .between(startOfMonth.toDate(), endOfMonth.toDate())
    .map(d => dayjs(d).get('date'))

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const fetchPermanences = async () => {
      const before = endOfMonth.toISOString()
      const after = startOfMonth.toISOString()

      const { data } = await api.getPermanences({ composterId: composter.rid, before, after })

      setPermanences(data['hydra:member'])
    }
    fetchPermanences()
  }, [composter.rid, endOfMonth, startOfMonth])

  const changeMonth = (action = 'add') => setDate(date[action](1, 'month'))

  const goOneMonthBack = () => {
    changeMonth('subtract')
  }
  const goOneMonthForward = () => {
    changeMonth('add')
  }

  const renderPermanence = perm => <PermanceCard permanence={perm} />

  const renderDefaultPermanenceDay = () => {
    const perm = {
      cancel: false,
      openers: []
    }
    return renderPermanence(perm)
  }

  const isThereAnyPermanences = day => perm => getDayInMonthFromPermanence(perm) === day

  const renderDay = day => {
    const permanencesOfTheDay = permanences.filter(isThereAnyPermanences(day))

    if (permanencesOfTheDay.length > 0) {
      return permanencesOfTheDay.map(renderWithKey(renderPermanence))
    }

    if (rulesDates.includes(day)) {
      return renderDefaultPermanenceDay()
    }
    return null
  }

  return (
    <ComposterContainer composter={composter}>
      <div className={classes.nav}>
        <Button onClick={goOneMonthBack} startIcon={<ChevronLeft />} />
        <Typography variant="h1">
          <p className={classes.mois}>{date.format('MMMM YYYY')}</p>
        </Typography>
        <Button onClick={goOneMonthForward} startIcon={<ChevronRight />} />
      </div>
      <Calendar date={date} renderDay={renderDay} />
    </ComposterContainer>
  )
}

ComposterPermanences.getInitialProps = async ({ query }) => {
  const [after, before] = ['startOf', 'endOf'].map(method => today[method]('month').toISOString())

  const { data: composter } = await api.getComposter(query.slug)
  const { data } = await api.getPermanences({ composterId: composter.rid, before, after })

  return {
    composter,
    perms: data['hydra:member']
  }
}

ComposterPermanences.propTypes = {
  composter: composterType.isRequired,
  perms: permanenceType.isRequired
}

export default ComposterPermanences
