import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Container, Box, Hidden, Paper } from '@material-ui/core'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import Header from '~/components/Header'
import ComposterProvider from '~/context/ComposterContext'
import AbilityProvider from '~/context/AbilityContext'
import { composterType } from '~/types'
import MenuLinks from './Menu/MenuLinks'
import SelectMenu from './Menu/SelectMenu'

const useStyles = makeStyles(theme => ({
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

const ComposterContainer = ({ composter, maxWidth, children }) => {
  const classes = useStyles()
  const { name, slug } = composter
  return (
    <ComposterProvider composter={composter}>
      <div className={classnames({ [classes.wrapper]: maxWidth })}>
        <AbilityProvider composterSlug={slug}>
          <Header title={name}>
            <MenuLinks />
          </Header>
          <Box my={4}>
            <Container>
              <Hidden smUp>
                <Box mb={2}>
                  <Paper>
                    <SelectMenu />
                  </Paper>
                </Box>
              </Hidden>
              {children}
            </Container>
          </Box>
        </AbilityProvider>
      </div>
    </ComposterProvider>
  )
}

ComposterContainer.defaultProps = {
  maxWidth: 'lg'
}

ComposterContainer.propTypes = {
  composter: composterType.isRequired,
  maxWidth: PropTypes.string,
  children: PropTypes.node.isRequired
}

export default ComposterContainer
