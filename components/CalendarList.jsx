import React, { memo, Fragment } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Paper } from '@material-ui/core'
import 'dayjs/locale/fr'
import palette from '../variables'

const renderWeekWithKey = renderFn => (data, i) => {
  const key = `week-${i}`
  return <Fragment key={key}>{renderFn(data)}</Fragment>
}
const renderDayWithKey = renderFn => (day, index) => {
  const key = `day-${day ||
    Math.random()
      .toString(36)
      .substring(7)}`
  return <Fragment key={key}>{renderFn(day, index)}</Fragment>
}

const weekDaysNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const sunDayInWeek = 7

const useStyles = makeStyles(({ spacing }) => ({
  day: {
    display: 'flex',
    padding: spacing(1),
    marginBottom: spacing(2),
    '& >  div + div': {
      flexGrow: 1,
      marginLeft: spacing(3)
    }
  },
  date: {
    textAlign: 'center'
  },
  dayName: {
    display: 'block',
    textTransform: 'uppercase',
    color: palette.greyMedium,
    fontSize: 12
  },
  dayDate: {
    display: 'block',
    fontWeight: 700,
    color: palette.greyDark
  }
}))

const propTypes = {
  renderDay: PropTypes.func.isRequired,
  date: PropTypes.shape({
    startOf: PropTypes.func.isRequired,
    daysInMonth: PropTypes.func.isRequired
  }).isRequired
}

const CalendarList = memo(({ date, renderDay }) => {
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
    const [TOP, BOTTOM, LEFT] = ['top', 'bottom', 'left']
    const getVerticalCoord = y => (y < 2 ? TOP : BOTTOM)

    const [vertical, horizontal] = monthCalendar.slice(0).reduce((acc, week, i, arr) => {
      if (week.includes(day)) {
        arr.splice(1)
        return [getVerticalCoord(day), LEFT]
      }
      return acc
    }, [])

    return {
      vertical,
      horizontal
    }
  }

  const renderWeekDay = (day, index) => {
    const days = renderDay(day, getSpacePosition(day, calendar))
    return (
      days && (
        <Paper className={classes.day}>
          <div className={classes.date}>
            <span className={classes.dayName}>{weekDaysNames[index]}</span>
            <span className={classes.dayDate}>{day}</span>
          </div>
          <div>{days}</div>
        </Paper>
      )
    )
  }

  const renderDays = week => {
    return week.map(renderDayWithKey(renderWeekDay))
  }

  const renderWeeks = fnRenderDays => week => {
    return fnRenderDays(week)
  }

  return <>{calendar.map(renderWeekWithKey(renderWeeks(renderDays)))}</>
})

CalendarList.propTypes = propTypes

export default CalendarList
