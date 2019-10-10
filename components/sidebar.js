import React from 'react'
import Link from 'next/link'

import { Paper, Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import palette from '../variables'

const useStyles = makeStyles(theme => ({
  sidebarContainer: {
    position: 'fixed',
    top: 0,
    minWidth: '420px',
    height: '100%',
    backgroundColor: 'white'
  },
  sidebarHeader: {
    textAlign: 'center',
    padding: theme.spacing(3.75),
    color: 'white',
    backgroundColor: palette.greenPrimary
  },
  sidebarContent: {
    padding: theme.spacing(3.75)
  },
  sidebarFooter: {
    padding: theme.spacing(3.75)
  }
}))

const Sidebar = () => {
  const classes = useStyles()

  return (
    <Paper component="section" elevation={2} className={classes.sidebarContainer}>
      <Box component="header" className={classes.sidebarHeader}>
        <Link href="/index" as="/">
          <a>
            <img src="/static/logo.svg" />
          </a>
        </Link>
        <Typography paragraph={true} align={'center'}>
          Carte des sites de compostage partagé
        </Typography>
      </Box>
      <Box component="section" className="sidebarContent"></Box>
      <Box component="footer" className="sidebarFooter"></Box>
    </Paper>
  )
}

export default Sidebar
