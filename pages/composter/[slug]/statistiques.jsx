import React, { useEffect, useContext } from 'react'
import { Line } from 'react-chartjs-2'
import { makeStyles } from '@material-ui/styles'
import { Paper, Typography } from '@material-ui/core'

import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import { ComposterContext } from '~/context/ComposterContext'

const useStyles = makeStyles(theme => ({
  graphContainer: {
    padding: theme.spacing(2)
  }
}))
const data = {
  labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  datasets: [
    {
      label: "Nombre d'utilisateurs",
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgb(245,245,245)',
      borderColor: palette.greenPrimary,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: palette.greenPrimary,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 4,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [0, 10, 50, 41, 23, 18, 11, 22, 44, 39, 25, 35]
    },
    {
      label: 'Nombre de sceaux',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgb(245,222,245)',
      borderColor: palette.orangePrimary,
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: palette.orangePrimary,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 4,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [1, 11, 21, 41, 27, 18, 1, 12, 22, 39, 8, 35]
    }
  ]
}

const ComposterStatistiques = ({ composter }) => {
  const classes = useStyles()

  return (
    <ComposterContainer composter={composter}>
      <Paper className={classes.graphContainer}>
        <Typography variant="h2">Nombre d'utilisateurs et de sceaux par date</Typography>
        <Line data={data} width={50} height={300} options={{ maintainAspectRatio: false }} />
      </Paper>
    </ComposterContainer>
  )
}

ComposterStatistiques.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterStatistiques
