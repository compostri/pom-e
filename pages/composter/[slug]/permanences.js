import React, { useState, useRef, useContext, useEffect } from 'react'
import { Typography, IconButton, Paper, TableRow, Table, TableCell, TableBody, TableHead, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'
import PermanenceCard from '~/components/PermanenceCard'
import palette from '~/variables'
import { ComposterContext } from '~/context/ComposterContext'

dayjs.locale('fr')

const useStyles = makeStyles(theme => ({
  mois: {
    color: palette.greyDark,
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  moisNav: {
    fontSize: 16
  },
  listingPermanences: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between'
  },
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

const permanences = [
  {
    date: '2007-06-26T00:00:00+00:00',
    ouvreur: ['ArnaudBan'],
    message: ''
  },
  {
    date: '2019-12-26T00:00:00+00:00',
    ouvreur: ['ArnaudBan'],
    message: ''
  },
  {
    date: '2019-12-26T00:00:00+00:00',
    ouvreur: ['Guillaume'],
    message: ''
  },
  {
    date: '2019-11-26T00:00:00+00:00',
    ouvreur: ['ArnaudBan', 'Guillaume'],
    message: 'Evennement compostri'
  },
  {
    date: '2019-11-26T00:00:00+00:00',
    ouvreur: [],
    message: ''
  }
]

const ComposterPermanences = ({ users }) => {
  const classes = useStyles()
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext

  const [value, setValue] = React.useState(0)

  useEffect(() => {
    composterContext.setComposter(composter)
  }, [])

  if (!composter) return null

  const weekDaysNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
  const listWeekDaysNames = weekDaysNames.map(weekDayName => (
    <TableCell key={weekDayName.toString()} align="center" className={classes.calendarDay}>
      {weekDayName}
    </TableCell>
  ))

  const [date, setDate] = useState(dayjs())
  const monthStart = date.startOf('month')
  const monthEnd = date.endOf('month').get('day')
  let curentMonthDayStart = monthStart.get('day')
  if (curentMonthDayStart === 0) {
    curentMonthDayStart = 7
  }

  let currentDayNum = 0
  let tableau = []
  const getCell = (line, day) => {
    if (line > 1 || curentMonthDayStart <= day) {
      currentDayNum++
    }

    return (
      <TableCell align="left" className={classes.calendarDayNumber}>
        {currentDayNum}
      </TableCell>
    )
  }
  let line = 1
  while (currentDayNum <= monthEnd) {
    let cells = []
    for (let day = 1; day < 8; day++) {
      cells.push(getCell(line, day))
    }

    tableau.push(<TableRow>{cells}</TableRow>)
    line++
  }

  return (
    <ComposterContainer composter={composter}>
      <div className={classes.sectionPermanences}>
        <div className={classes.nav}>
          <Button startIcon={<ChevronLeft onClick={() => setDate(date.subtract(1, 'month'))} />} />
          <Typography variant="h1">
            <p className={classes.mois}>{date.format('MMMM YYYY')}</p>
          </Typography>
          <Button startIcon={<ChevronRight onClick={() => setDate(date.add(1, 'month'))} />} />
        </div>
        <Paper elevation={1} className={classes.calendar}>
          <Table stickyHeader className={classes.calendarTable}>
            <TableHead>
              <TableRow>{listWeekDaysNames}</TableRow>
            </TableHead>
            <TableBody>{tableau}</TableBody>
          </Table>
        </Paper>
      </div>
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
