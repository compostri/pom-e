import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Container, Button, Box, Hidden, Select, MenuItem } from '@material-ui/core'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'

import Header from '~/components/Header'
import ComposterProvider from '~/context/ComposterContext'
import AbilityProvider, { Can, Action, Subject } from '~/context/AbilityContext'
import palette from '~/variables'
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
            <Hidden xsDown>
              <MenuLinks />
            </Hidden>
          </Header>
          <Box my={4}>
            <Container>
              <Hidden smUp>
                <SelectMenu />
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
