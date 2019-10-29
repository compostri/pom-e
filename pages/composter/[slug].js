import React from 'react'
import api from '../../utils/api'
import { Paper, Typography, AppBar } from '@material-ui/core'

const Header = ({ title }) => (
  <AppBar>
    <Typography variant="h1">{title}</Typography>
  </AppBar>
)

const Content = ({ composter }) => {
  return (
    <>
      <Paper>
        <Typography variant="h2">Informations sur le site de compostage</Typography>
        <Typography paragraph>{composter.address}</Typography>
      </Paper>
      <Paper>
        <Typography variant="h2">Contactez-nous pour toutes vos questions</Typography>
      </Paper>
    </>
  )
}

const ComposterDetail = ({ composter }) => {
  return (
    <>
      <Header title={composter.name} />
      <Content composter={composter} />
    </>
  )
}

ComposterDetail.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterDetail
