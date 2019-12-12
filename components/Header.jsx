import React from 'react'
import Link from 'next/link'
import { Typography, AppBar, Toolbar, IconButton, Box, Hidden } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '~/variables'
import UserButton from './UserButton'

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'white',
    marginBottom: theme.typography.pxToRem(36),
    position: 'relative',
    zIndex: theme.zIndex.appBar
  },
  logo: {
    width: 80,
    height: 175,
    backgroundColor: palette.greenPrimary,
    borderRadius: '0',
    [theme.breakpoints.down('md')]: {
      width: 55,
      height: 105
    }
  },
  logoSvg: {
    display: 'Block',
    margin: '0 auto'
  },
  toolbarGlobal: {
    alignItems: 'stretch'
  },
  toolbarTitle: {
    flexGrow: 1,
    flexWrap: 'wrap',
    display: 'flex',
    alignItems: 'center'
  },
  toolbarLeft: {
    padding: theme.spacing(5, 4, 0, 4),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
      justifyContent: 'center',
      alignItems: 'center'
    }
  },
  chevronLeft: {
    padding: '0',
    alignSelf: 'flex-start'
  },
  title: {
    color: palette.greyDark,
    fontSize: 28,
    fontWeight: '700',
    [theme.breakpoints.down('sm')]: {
      fontSize: 18
    }
  },
  children: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing(0, 2),
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  }
}))

const Header = ({ title, children }) => {
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
          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <div className={classes.toolbarTitle}>
              <Hidden smDown implementation="css">
                <Link href="/" passHref>
                  <IconButton className={classes.chevronLeft}>
                    <ChevronLeft />
                  </IconButton>
                </Link>
              </Hidden>
              <Typography variant="h1" className={classes.title}>
                {title}
              </Typography>
            </div>

            <UserButton />
          </Box>

          <div className={classes.children}>{children}</div>
        </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header
