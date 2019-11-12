import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Container } from '@material-ui/core'
import Header from '~/components/ComposterHeader'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2, 5, 2, 10)
  }
}))

const ComposterContainer = ({ composter, maxWidth = false, children }) => {
  const classes = useStyles()

  return (
    <>
      <Header composter={composter} />
      <Container maxWidth={maxWidth} className={classes.container}>
        {children}
      </Container>
    </>
  )
}

export default ComposterContainer
