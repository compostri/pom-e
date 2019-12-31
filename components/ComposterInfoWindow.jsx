import React from 'react'
import Link from 'next/link'
import { Typography, List, ListItem, ListItemText, ListItemIcon, Box, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Room, Person, RadioButtonChecked } from '@material-ui/icons'

import { composterType } from '~/types'
import DefaultImage from '~/components/DefaultImage'
import { getComposterColor } from '~/utils/utils'

import palette from '~/variables'

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    maxWidth: 400,
    display: 'block',
    textDecoration: 'none',
    padding: spacing(2)
  },
  containerInfo: {
    padding: spacing(1),
    marginTop: spacing(1),
    backgroundColor: palette.greyExtraLight
  },
  listItem: {
    padding: 0
  },
  infoIcone: {
    padding: 0,
    marginRight: spacing(1),
    minWidth: 10
  },
  image: {
    height: 'auto',
    width: '100%'
  }
}))

const propTypes = { composter: composterType.isRequired }

const ComposterInfoWindow = ({ composter }) => {
  const classes = useStyles()
  const composterColor = getComposterColor(composter)

  return (
    <Link href="/composteur/[slug]" as={`/composteur/${composter.slug}`} passHref>
      <a className={classes.container}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            {composter.image && composter.image !== 'null' ? (
              <img src={composter.image} alt={`Le composteur ${composter.name}`} className={classes.image} />
            ) : (
              <DefaultImage composter={composter} />
            )}
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
                    <ListItemText>{composter.communeName}</ListItemText>
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
