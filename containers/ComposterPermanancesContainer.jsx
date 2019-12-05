import React, { useState, useMemo, Fragment, useCallback, useContext, useEffect, useRef } from 'react'
import { rrulestr } from 'rrule'
import PropTypes from 'prop-types'
import { Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import PermanceCard, { PermanenceToComeDetails } from '~/components/PermanenceCard'
import palette from '~/variables'

import Calendar from '~/components/Calendar'

import { ComposterPermanencesContext } from '~/context/ComposterPermamencesContext'

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
  },
  permanence: {
    padding: 6
  }
}))

const today = dayjs()

const getDayInMonth = date => dayjs(date).get('date')
const getDayInMonthFromPermanence = ({ date }) => getDayInMonth(date)
const renderWithKey = renderFn => (data, i) => {
  const key = `permanence-${data.date}-${i}`
  return <Fragment key={key}>{renderFn(data)}</Fragment>
}

const propTypes = {
  permanencesRule: PropTypes.string.isRequired
}

const ComposterPermanancesContainer = ({ permanencesRule }) => {
  const isInitialMount = useRef(true)
  const classes = useStyles()

  const { permanences, addPermanenceDetails, permanenceDetails, retrievePermanences, removePermanenceDetails, updatePermanenceDetails } = useContext(
    ComposterPermanencesContext
  )

  const [date, setDate] = useState(today)

  const startOfMonth = useMemo(() => date.startOf('month'), [date])
  const endOfMonth = useMemo(() => date.endOf('month'), [date])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const after = startOfMonth.toISOString()
    const before = endOfMonth.toISOString()

    retrievePermanences({ before, after })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endOfMonth, startOfMonth])

  const changeMonth = (action = 'add') => {
    setDate(date[action](1, 'month'))
  }

  const goOneMonthBack = () => {
    changeMonth('subtract')
  }
  const goOneMonthForward = () => {
    changeMonth('add')
  }

  const handleClick = useCallback(
    (permanence, { vertical, horizontal }) => ({ currentTarget }) => {
      addPermanenceDetails(permanence, {
        $popover: {
          anchorEl: currentTarget,
          vPos: vertical,
          hPos: horizontal
        }
      })
    },
    [addPermanenceDetails]
  )

  const isThereAnyPermanences = day => perm => getDayInMonthFromPermanence(perm) === day

  const renderDay = useCallback(
    (day, position) => {
      if (permanences.fetching) {
        return null
      }

      const rulesDates = rrulestr(permanencesRule, { forceset: true })
        .between(startOfMonth.toDate(), endOfMonth.toDate())
        .map(d => dayjs(d).get('date'))

      const renderPermanence = pos => perm => {
        return (
          <Button className={classes.permanence} classes={{ root: classes.permanenceRoot }} onClick={handleClick(perm, pos)}>
            <PermanceCard permanence={perm} />
          </Button>
        )
      }

      const renderDefaultPermanenceDay = pos => {
        const perm = {
          date: date.date(day).toISOString(),
          openers: []
        }
        return renderPermanence(pos)(perm)
      }

      const permanencesOfTheDay = permanences.data.filter(isThereAnyPermanences(day))

      if (permanencesOfTheDay.length > 0) {
        return permanencesOfTheDay.map(renderWithKey(renderPermanence(position)))
      }

      if (rulesDates.includes(day)) {
        return renderDefaultPermanenceDay(position)
      }
      return null
    },
    [classes.permanence, classes.permanenceRoot, permanencesRule, date, endOfMonth, handleClick, permanences, startOfMonth]
  )

  const maybeRenderPopover = ({ $popover, ...details }) => {
    return (
      $popover &&
      details && (
        <PermanenceToComeDetails
          anchorEl={$popover.anchorEl}
          permanence={details}
          vertical={$popover.vPos}
          horizontal={$popover.hPos}
          onClose={removePermanenceDetails}
          onSubmit={updatePermanenceDetails}
        />
      )
    )
  }

  return (
    <>
      <div className={classes.nav}>
        <Button onClick={goOneMonthBack} startIcon={<ChevronLeft />} />
        <Typography variant="h1">
          <p className={classes.mois}>{date.format('MMMM YYYY')}</p>
        </Typography>
        <Button onClick={goOneMonthForward} startIcon={<ChevronRight />} />
      </div>
      <Calendar date={date} renderDay={renderDay} />
      {maybeRenderPopover((permanenceDetails || {}).data || {})}
    </>
  )
}

ComposterPermanancesContainer.propTypes = propTypes

export default ComposterPermanancesContainer
