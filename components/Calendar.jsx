import React, { memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Paper, TableRow, Table, TableCell, TableBody, TableHead } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import 'dayjs/locale/fr'

import palette from '~/variables'

const renderWeekNameWithKey = renderFn => name => {
  return <Fragment key={name}>{renderFn(name)}</Fragment>
}
const renderWeekWithKey = renderFn => (data, i) => {
  const key = `week-${i}`
  return <Fragment key={key}>{renderFn(data)}</Fragment>
}
const renderDayWithKey = renderFn => day => {
  const key = `day-${day ||
    Math.random()
      .toString(36)
      .substring(7)}`
  return <Fragment key={key}>{renderFn(day)}</Fragment>
}

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
  tableCell: {
    color: palette.greyLight,
    position: 'relative',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 1.71,
    height: '180px',
    padding: 0
  },
  tableCellContent: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    width: '100%'
  },
  tableCellContentDay: {
    alignSelf: 'start',
    padding: 0
  }
}))

const propTypes = {
  renderDay: PropTypes.func.isRequired,
  date: PropTypes.shape({
    startOf: PropTypes.func.isRequired,
    daysInMonth: PropTypes.func.isRequired
  }).isRequired
}

const Calendar = memo(({ date, renderDay }) => {
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

  const getSpacePosition = (day, monthCalendar) => {
    const [TOP, BOTTOM, LEFT, RIGHT] = ['top', 'bottom', 'left', 'right']
    const getHorizontalCoord = x => (x < 4 ? LEFT : RIGHT)
    const getVerticalCoord = y => (y < 1 ? TOP : BOTTOM)

    const [vertical, horizontal] = monthCalendar.slice(0).reduce((acc, week, i, arr) => {
      if (week.includes(day)) {
        arr.splice(1)
        return [getVerticalCoord(i), getHorizontalCoord(week.indexOf(day))]
      }
      return acc
    }, [])

    return {
      vertical,
      horizontal
    }
  }

  const renderWeekDayNames = weekDayName => (
    <TableCell align="center" className={classes.calendarDay}>
      {weekDayName}
    </TableCell>
  )

  const renderWeekDay = day => {
    return (
      <TableCell align="left" className={classes.tableCell}>
        <div key={day} className={classes.tableCellContent}>
          <span className={classes.tableCellContentDay}>{day}</span>
          {renderDay(day, getSpacePosition(day, calendar))}
        </div>
      </TableCell>
    )
  }

  const renderDays = week => week.map(renderDayWithKey(renderWeekDay))

  const renderWeeks = fnRenderDays => week => <TableRow>{fnRenderDays(week)}</TableRow>

  return (
    <Paper elevation={1} className={classes.calendar}>
      <Table stickyHeader className={classes.calendarTable}>
        <TableHead>
          <TableRow>{weekDaysNames.map(renderWeekNameWithKey(renderWeekDayNames))}</TableRow>
        </TableHead>
        <TableBody>{calendar.map(renderWeekWithKey(renderWeeks(renderDays)))}</TableBody>
      </Table>
    </Paper>
  )
})

Calendar.propTypes = propTypes

export default Calendar
