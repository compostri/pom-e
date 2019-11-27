import React from 'react'
import Link from 'next/link'
import { Typography, AppBar, Toolbar, IconButton, Box } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '~/variables'
import UserButton from './UserButton'

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'white',
    marginBottom: theme.typography.pxToRem(36)
  },
  logo: {
    width: 80,
    height: 175,
    backgroundColor: palette.greenPrimary,
    borderRadius: '0'
  },
  logoSvg: {
    display: 'Block',
    margin: '0 auto',
    paddingBottom: theme.spacing(8)
  },
  toolbarGlobal: {
    alignItems: 'stretch'
  },
  toolbarTitle: {
    flexGrow: 1,
    marginTop: theme.spacing(1),
    flexWrap: 'wrap',
    display: 'flex'
  },
  toolbarLeft: {
    padding: theme.spacing(5, 4, 0, 4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  chevronLeft: {
    padding: '0',
    alignSelf: 'flex-start'
  },
  title: {
    color: palette.greyDark,
    fontSize: '28px',
    fontWeight: '700'
  },
  children: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(0, 2)
  }
}))

const Header = props => {
  const classes = useStyles()

  return (
    <AppBar className={classes.appBar} position="static" elevation={1}>
      <Toolbar className={classes.toolbarGlobal} disableGutters>
        <Link href="/" passHref>
          <IconButton className={classes.logo}>
            <img className={classes.logoSvg} src="/static/logo2.svg" alt="Logo compostri" />
          </IconButton>
        </Link>
        <div className={classes.toolbarLeft}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
            <div className={classes.toolbarTitle}>
              <Link href="/" passHref>
                <IconButton className={classes.chevronLeft}>
                  <ChevronLeft />
                </IconButton>
              </Link>
              <Typography variant="h1" className={classes.title}>
                {props.title}
              </Typography>
            </div>

            <UserButton />
          </Box>

          <div className={classes.children}>{props.children}</div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header
