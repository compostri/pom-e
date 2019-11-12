import React from 'react'
import { Typography, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'
import PermanenceCard from '~/components/PermanenceCard'
import palette from '~/variables'

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

const ComposterPermanences = ({ composter, users }) => {
  const classes = useStyles()
  const perm = permanences.map((p, index) => <PermanenceCard permanence={p} users={users} key={`perm-${index}-${p.date}`} />)

  return (
    <ComposterContainer composter={composter}>
      <div className={classes.sectionPermanences}>
        <Typography variant="h1">
          <p className={classes.mois}>{dayjs().format('MMMM YYYY')}</p>
        </Typography>
        <div className={classes.listingPermanences}>{perm}</div>
        <div className={classes.nav}>
          <Link href="" passHref>
            <IconButton className={classes.chevronLeft}>
              <ChevronLeft />
              <p className={[classes.mois, classes.moisNav].join(' ')}>
                {dayjs()
                  .subtract(1, 'month')
                  .format('MMM YY')}
              </p>
            </IconButton>
          </Link>
          <Link href="" passHref>
            <IconButton className={classes.chevronLeft}>
              <p className={[classes.mois, classes.moisNav].join(' ')}>
                {dayjs()
                  .add(1, 'month')
                  .format('MMM YY')}
              </p>
              <ChevronRight />
            </IconButton>
          </Link>
        </div>
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
