import React, { useState, useEffect, useMemo, useRef, Fragment, useCallback } from 'react'
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
import { PopoverPermanenceToCome } from '~/components/PermanenceCard/PermanenceCardPopover/PermanenceCardPopover'
import palette from '~/variables'

import Calendar from '~/components/Calendar'
import { useToasts, TOAST } from '~/components/Snackbar'

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

const ComposterPermanences = ({ perms, composter }) => {
  const classes = useStyles()

  const isInitialMount = useRef(true)
  const { addToast } = useToasts()

  const [date, setDate] = useState(today)
  const [permanences, setPermanences] = useState(perms)
  const [permanenceDetails, setPermanenceDetails] = useState(null)

  const startOfMonth = useMemo(() => date.startOf('month'), [date])
  const endOfMonth = useMemo(() => date.endOf('month'), [date])

  const handlePopoverClosing = () => {
    setPermanenceDetails(null)
  }

  const fetchPermanences = useCallback(async () => {
    const before = endOfMonth.toISOString()
    const after = startOfMonth.toISOString()

    const { data, status } = await api.getPermanences({ composterId: composter.rid, before, after })
    if (status === 200) {
      handlePopoverClosing()
      setPermanences(data['hydra:member'])
    }
  }, [composter.rid, endOfMonth, startOfMonth])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    fetchPermanences()
  }, [fetchPermanences])

  const changeMonth = (action = 'add') => setDate(date[action](1, 'month'))

  const goOneMonthBack = () => {
    changeMonth('subtract')
  }
  const goOneMonthForward = () => {
    changeMonth('add')
  }

  const handleSubmit = async (permId, openers) => {
    api.putPermanences(permId, { openers }).then(res => {
      if (res.status === 200) {
        addToast('Votre demande a bien été prise en compte !', TOAST.SUCCESS)
        fetchPermanences()
      } else {
        addToast('Une erreur a eu lieu', TOAST.ERROR)
      }
    })
  }
  const handleClick = (perm, { vertical, horizontal }) => ({ currentTarget }) => {
    setPermanenceDetails({
      data: perm,
      anchorEl: currentTarget,
      vPos: vertical,
      hPos: horizontal
    })
  }

  const isThereAnyPermanences = day => perm => getDayInMonthFromPermanence(perm) === day

  const renderDay = useCallback(
    (day, position) => {
      const rulesDates = rrulestr(composter.permanencesRule, { forceset: true })
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
          cancel: false,
          openers: []
        }
        return renderPermanence(pos)(perm)
      }

      const permanencesOfTheDay = permanences.filter(isThereAnyPermanences(day))

      if (permanencesOfTheDay.length > 0) {
        return permanencesOfTheDay.map(renderWithKey(renderPermanence(position)))
      }

      if (rulesDates.includes(day)) {
        return renderDefaultPermanenceDay(position)
      }
      return null
    },
    [classes.permanence, classes.permanenceRoot, composter.permanencesRule, endOfMonth, permanences, startOfMonth]
  )

  const { anchorEl, data: currentPermanence, hPos, vPos } = permanenceDetails || {}

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
      {anchorEl && currentPermanence && (
        <PopoverPermanenceToCome
          anchorEl={anchorEl}
          permanence={currentPermanence}
          vertical={vPos}
          horizontal={hPos}
          onClose={handlePopoverClosing}
          onSubmit={handleSubmit}
        />
      )}
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
