import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Button, Typography, Paper, List, ListItem, ListItemText, ListItemIcon, Box, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Room, Person, RadioButtonChecked } from '@material-ui/icons'

import ReactMapGL, { Popup, Source, Layer, NavigationControl } from 'react-map-gl'

import { composterType } from '~/types'
import Sidebar from '~/components/Sidebar'
import DefaultImage from '~/components/DefaultImage'
import { getComposterColor } from '~/utils/utils'

import api from '~/utils/api'
import UserButton from '~/components/UserButton'
import palette from '~/variables'
import theme from '~/theme'

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    maxWidth: 400,
    display: 'block',
    textDecoration: 'none',
    padding: theme.spacing(2)
  },
  containerInfo: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
    backgroundColor: palette.greyExtraLight
  },
  listItem: {
    padding: 0
  },
  infoIcone: {
    padding: 0,
    marginRight: theme.spacing(1),
    minWidth: 10
  }
}))

const propTypes = { composter: composterType.isRequired }

const ComposterInfoWindow = ({ composter }) => {
  const classes = useStyles()
  const composterColor = getComposterColor(composter)

  return (
    <Link href="/composter/[slug]" as={`/composter/${composter.slug}`} passHref>
      <a className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {composter.image ? <img src={composter.image} alt="Composteur" id="imgComposter" /> : <DefaultImage composter={composter} />}
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h2" component="h2">
              {composter.name}
            </Typography>
            <Box className={classes.containerInfo}>
              <List disablePadding>
                <div>
                  <ListItem className={classes.listItem}>
                    <ListItemIcon className={classes.infoIcone}>
                      <Room fontSize="small" style={{ color: composterColor }} />
                    </ListItemIcon>
                    <ListItemText>{composter.commune.name}</ListItemText>
                  </ListItem>
                </div>
                <div>
                  <ListItem className={classes.listItem}>
                    <ListItemIcon className={classes.infoIcone}>
                      <RadioButtonChecked fontSize="small" style={{ color: composterColor }} />
                    </ListItemIcon>
                    <ListItemText>{composter.categorieName}</ListItemText>
                  </ListItem>
                </div>
                <div className={classes.InfoImg}>
                  <ListItem className={classes.listItem}>
                    <ListItemIcon className={classes.infoIcone}>
                      <Person fontSize="small" style={{ color: composterColor }} />
                    </ListItemIcon>
                    <ListItemText>{composter.acceptNewMembers ? 'Accepte' : "N'accepte pas"} de nouveau adhérents</ListItemText>
                  </ListItem>
                </div>
              </List>
            </Box>
          </Grid>
        </Grid>
      </a>
    </Link>
  )
}

ComposterInfoWindow.propTypes = propTypes

export default ComposterInfoWindow
