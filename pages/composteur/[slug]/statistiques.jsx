import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography, Box } from '@material-ui/core'
import dayjs from 'dayjs'
import Head from 'next/head'

import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import { composterType, permanenceType } from '~/types'
import StatsFilters from '~/components/forms/StatsFilter'

const useStyles = makeStyles(theme => ({
  graphContainer: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    height: 400,
    position: 'relative'
  },
  inner: {
    position: 'static'
  },
  blur: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noData: {
    backgroundColor: 'white',
    padding: theme.spacing(1)
  }
}))

const commonGraphStyle = {
  fill: false,
  lineTension: 0.1,
  backgroundColor: 'rgb(245,222,245)',
  borderColor: palette.redPrimary,
  borderCapStyle: 'butt',
  borderDash: [],
  borderDashOffset: 0.0,
  borderJoinStyle: 'miter',
  pointBorderColor: palette.redPrimary,
  pointBackgroundColor: '#fff',
  pointBorderWidth: 4,
  pointHoverRadius: 5,
  pointHoverBackgroundColor: 'rgba(75,192,192,1)',
  pointHoverBorderColor: 'rgba(220,220,220,1)',
  pointHoverBorderWidth: 2,
  pointRadius: 1,
  pointHitRadius: 10
}

const lineNbBucketsStyle = {
  ...commonGraphStyle,
  borderColor: palette.redPrimary,
  pointBorderColor: palette.redPrimary
}
const lineNbUsersStyle = {
  ...commonGraphStyle,
  borderColor: palette.greenPrimary,
  pointBorderColor: palette.greenPrimary
}

const propTypes = {
  permanences: PropTypes.arrayOf(permanenceType).isRequired,
  composter: composterType.isRequired
}

const zeroIfNull = val => (val === null ? 0 : val)
const orderedByDate = perms => perms.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)))

const withOnePermanenceByDate = perms =>
  perms.reduce((acc, curr) => {
    const sameDatePermanence = acc.find(({ date }) => dayjs(date).isSame(dayjs(curr.date), 'date'))

    if (sameDatePermanence) {
      return [
        ...acc.filter(perm => perm['@id'] !== sameDatePermanence['@id']),
        {
          ...curr,
          nbUsers: zeroIfNull(curr.nbUsers) + zeroIfNull(sameDatePermanence.nbUsers),
          nbBuckets: zeroIfNull(curr.nbBuckets) + zeroIfNull(sameDatePermanence.nbBuckets)
        }
      ]
    }

    return [...acc, curr]
  }, [])

const ComposterStatistiques = ({ composter, permanences }) => {
  const classes = useStyles()

  const permanencesData = useMemo(() => orderedByDate(withOnePermanenceByDate(permanences)), [permanences])

  const { nbBucketsData, nbUsersData, days } = permanencesData.reduce(
    (acc, { nbBuckets, nbUsers, date }) => {
      return {
        ...acc,
        nbBucketsData: [...acc.nbBucketsData, zeroIfNull(nbBuckets)],
        nbUsersData: [...acc.nbUsersData, zeroIfNull(nbUsers)],
        days: [...acc.days, date]
      }
    },
    { nbBucketsData: [], nbUsersData: [], days: [] }
  )

  const data = {
    labels: days,
    datasets: [
      {
        ...lineNbUsersStyle,
        label: "Nombre d'utilisateurs",
        data: nbUsersData
      },
      {
        ...lineNbBucketsStyle,
        label: 'Nombre de seaux',
        data: nbBucketsData
      }
    ]
  }

  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>Les statistiques de {composter.name} - un composteur géré par Compostri</title>
      </Head>
      <Paper className={classes.graphContainer}>
        <Box className={classes.inner}>
          <Typography variant="h2">Nombre d‘utilisateurs et de seaux par date</Typography>
          <StatsFilters />
          <Line
            data={data}
            width={50}
            height={300}
            options={{
              maintainAspectRatio: false,
              scales: {
                yAxes: [{ ticks: { beginAtZero: true } }],
                xAxes: [{ type: 'time' }]
              }
            }}
          />
          {permanencesData.length === 0 && (
            <Box className={classes.blur}>
              <Box className={classes.noData}>
                <Typography>Aucune donnée pour le moment</Typography>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </ComposterContainer>
  )
}

ComposterStatistiques.propTypes = propTypes

const undefinedIfNotSet = value => {
  if (value && value.length > 0) {
    return value
  }

  return undefined
}

ComposterStatistiques.getInitialProps = async ({ query }) => {
  const fromDate = undefinedIfNotSet(query.fromDate)
  const toDate = undefinedIfNotSet(query.toDate)
  const { data: composter } = await api.getComposter(query.slug)

  let before = dayjs(toDate)
  let after = dayjs(fromDate)
  if (!fromDate) {
    // par défaut, définir un intervalle
    after = after.subtract(1, 'month')
  }
  // on inclue la date selectionnée (après avoir éventuellement appliqué l'intervalle)
  before = before.add(1, 'day')
  const permanences = (await api.getPermanences({ composterId: composter.rid, before: before.format('YYYY-MM-DD'), after: after.format('YYYY-MM-DD') }))[
    'hydra:member'
  ]

  return {
    composter,
    permanences
  }
}

export default ComposterStatistiques
