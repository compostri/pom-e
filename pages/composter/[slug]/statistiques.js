import React from 'react'
import api from '~/utils/api'
import Header from '~/components/ComposterHeader'
import { Line } from 'react-chartjs-2'
import { makeStyles, Typography } from '@material-ui/core'
import { Paper } from '@material-ui/core'
import palette from '~/variables'

const useStyles = makeStyles(theme => ({
  statContainer: {
    position: 'relative',
    top: 100,
    marginLeft: '40px',
    marginRight: '40px',
    padding: theme.spacing(10, 7, 2, 7)
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
    <>
      <Header title={composter.name} />
      <Paper className={classes.statContainer}>
        {/*<Typography variant="p">Nombre d'utilisateurs et de sceaux par date</Typography>*/}
        <Line data={data} width={50} height={300} options={{ maintainAspectRatio: false }} />
      </Paper>
    </>
  )
}

ComposterStatistiques.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterStatistiques
