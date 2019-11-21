import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Paper, TableRow, Table, TableCell, TableBody, TableHead } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import 'dayjs/locale/fr'

import palette from '~/variables'

const [Mon, Tus, Wed, Thu, Fry, Sat, Sun] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
const weekDaysNames = [Mon, Tus, Wed, Thu, Fry, Sat, Sun]

const sunDayInWeek = 7

const useStyles = makeStyles(theme => ({
  calendar: {
    borderRadius: 2
  },
  calendarTable: {
    minWidth: '100%'
  },
  calendarDay: {
    color: palette.greyLight,
    padding: theme.spacing(2),
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    backgroundColor: 'white'
  },
  calendarDayNumber: {
    color: palette.greyLight,
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1.71
  }
}))

const propTypes = {
  eventsDate: PropTypes.arrayOf(PropTypes.number),
  date: PropTypes.shape({
    startOf: PropTypes.func.isRequired,
    daysInMonth: PropTypes.func.isRequired
  }).isRequired
}

const defaultProps = {
  eventsDate: []
}

const Calendar = memo(({ date, eventsDate }) => {
  const classes = useStyles()
  const lastDayOfMonth = date.daysInMonth() // day 28 | 29 | 30 | 31

  const dayStartInMonth = date.startOf('month').get('day') || sunDayInWeek

  const padding = [...new Array(dayStartInMonth - 1)]
  const daysInMonth = [...new Array(lastDayOfMonth)].map((_v, i) => i + 1)

  const calendar = [...padding, ...daysInMonth].reduce(
    (calendarOfMonth, dayOfMonth) => {
      const dayInWeek = weekDaysNames.length
      const currentWeekOfMonth = calendarOfMonth.length // week 1 | 2 | 3 | 4
      const row = currentWeekOfMonth - 1

      if (calendarOfMonth[row] && calendarOfMonth[row].length < dayInWeek) {
        const calendarOfMonthref = calendarOfMonth
        calendarOfMonthref[row] = [...calendarOfMonth[row], dayOfMonth]
        return calendarOfMonthref
      }
      return [...calendarOfMonth, [dayOfMonth]]
    },
    [[]]
  )

  const listWeekDaysNames = weekDaysNames.map(weekDayName => (
    <TableCell key={weekDayName} align="center" className={classes.calendarDay}>
      {weekDayName}
    </TableCell>
  ))

  const withMayBeSomeEvents = events => fnRenderDay => day => {
    if (events.includes(day)) {
      return <>{fnRenderDay(day)} wow</>
    }

    return fnRenderDay(day)
  }

  const renderDay = (day, i) => (
    <TableCell key={`${day}-${i}`} align="center" className={classes.calendarDayNumber}>
      {day}
    </TableCell>
  )

  const renderDays = week => week.map(withMayBeSomeEvents(eventsDate)(renderDay))

  const renderWeeks = fnRenderDays => week => <TableRow>{fnRenderDays(week)}</TableRow>

  return (
    <Paper elevation={1} className={classes.calendar}>
      <Table stickyHeader className={classes.calendarTable}>
        <TableHead>
          <TableRow>{listWeekDaysNames}</TableRow>
        </TableHead>
        <TableBody>{calendar.map(renderWeeks(renderDays))}</TableBody>
      </Table>
    </Paper>
  )
})

Calendar.propTypes = propTypes
Calendar.defaultProps = defaultProps

export default Calendar
