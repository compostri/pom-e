import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Container } from '@material-ui/core'
import classesname from 'classnames'
import Header from '~/components/ComposterHeader'
import AbilityProvider from '~/context/AbilityContext'

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100vh'
  },
  container: {
    padding: theme.spacing(2, 5, 2, 10)
  },
  containerCenter: {
    padding: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }
}))

const ComposterContainer = ({ composter, maxWidth = false, children }) => {
  const classes = useStyles()

  return (
    <div className={classesname({ [classes.wrapper]: maxWidth })}>
      <AbilityProvider composterSlug={composter['@id']}>
        <Header composter={composter} />
        <Container maxWidth={maxWidth} className={classesname(classes.container, { [classes.containerCenter]: maxWidth })}>
          {children}
        </Container>
      </AbilityProvider>
    </div>
  )
}

export default ComposterContainer
