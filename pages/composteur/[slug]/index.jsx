import React, { useContext } from 'react'
import Link from 'next/link'
import { Paper, Typography, List, ListItem, ListItemText, ListItemIcon, Fab, Grid } from '@material-ui/core'
import { Room, Person, RadioButtonChecked, Lock, WatchLater, Edit } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Head from 'next/head'

import { composterType } from '~/types'

import { Can, Action, Subject } from '~/context/AbilityContext'
import api from '~/utils/api'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import MapField from '~/components/MapField'
import ComposterContactForm from '~/components/forms/composter/ComposterContactForm'
import { ComposterContext } from '~/context/ComposterContext'
import DefaultImage from '~/components/DefaultImage'

const { MODIFY } = Action
const { COMPOSTER_INFORMATION } = Subject

const useStyles = makeStyles(theme => ({
  info: {
    display: 'flex',
    padding: theme.spacing(2, 2, 2, 2),
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('xs')]: {
      flexWrap: 'wrap'
    }
  },
  infoLeft: {
    textAlign: 'left',
    [theme.breakpoints.down('xs')]: {
      textAlign: 'center',
      flexGrow: 1
    }
  },
  infoRight: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0
    }
  },
  infoTitle: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  edit: {
    marginBottom: theme.spacing(1)
  },
  editIcon: { width: 15 },

  titleSectionSecondary: {
    paddingBottom: theme.spacing(2)
  },
  listItem: {
    padding: '0'
  },
  infoIcone: {
    color: palette.greenPrimary,
    width: '15px',
    padding: '0'
  },
  infoList: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2),
    marginTop: theme.spacing(1)
  },
  contactezNous: {
    padding: theme.spacing(2, 2, 2, 2)
  },
  submit: {
    color: 'white',
    '&:hover': {
      backgroundColor: palette.redOpacity
    }
  },
  inputGlobal: {
    margin: theme.spacing(1, 0, 2, 0)
  },
  input: {
    marginTop: theme.spacing(2)
  },
  map: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    minHeight: 200
  },
  image: {
    maxWidth: 200,
    height: 'auto'
  }
}))

const Content = () => {
  const classes = useStyles()
  const { composterContext } = useContext(ComposterContext)
  const { composter } = composterContext

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={composter.lat && composter.lng ? 8 : 12} xs={12}>
          <Paper className={classes.info}>
            <div className={classes.infoLeft}>
              {composter.image && composter.image.contentUrl ? (
                <img
                  src={composter.image.contentUrl}
                  alt={`Le composteur ${composter.name}`}
                  width={composter.image.imageDimensions[0]}
                  height={composter.image.imageDimensions[1]}
                  className={classes.image}
                />
              ) : (
                <DefaultImage composter={composter} />
              )}
            </div>
            <div className={classes.infoRight}>
              <div className={classes.infoTitle}>
                <Typography variant="h2" className={classes.titleSectionSecondary}>
                  Informations sur le site de compostage
                </Typography>
                <Can I={MODIFY} this={COMPOSTER_INFORMATION}>
                  <Link href="/composter/[slug]/modifications" as={`/composter/${composter.slug}/modifications`} passHref>
                    <Fab size="small" color="secondary" aria-label="edit" className={classes.edit}>
                      <Edit className={classes.editIcon} />
                    </Fab>
                  </Link>
                </Can>
              </div>
              <Typography>{composter.publicDescription}</Typography>
              <List className={classes.infoList}>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Room className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText className={classes.listItem}>{composter.address}</ListItemText>
                </ListItem>
                {composter.categorie && (
                  <ListItem className={classes.listItem}>
                    <ListItemIcon>
                      <RadioButtonChecked className={classes.infoIcone} />
                    </ListItemIcon>
                    <ListItemText>{composter.categorie.name}</ListItemText>
                  </ListItem>
                )}
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Person className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>{composter.acceptNewMembers ? 'Accepte' : "N'accepte pas"} de nouveaux adhérents</ListItemText>
                </ListItem>

                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Lock className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>{composter.status === 'Active' ? 'En service' : 'Hors service'}</ListItemText>
                </ListItem>
                {composter.permanencesDescription && (
                  <ListItem className={classes.listItem}>
                    <ListItemIcon>
                      <WatchLater className={classes.infoIcone} />
                    </ListItemIcon>
                    <ListItemText>{composter.permanencesDescription}</ListItemText>
                  </ListItem>
                )}
              </List>
            </div>
          </Paper>

          <Paper elevation={1} className={classes.contactezNous}>
            <Typography className={classes.titleSectionSecondary} variant="h2">
              Contactez-nous pour toutes vos questions
            </Typography>
            <ComposterContactForm />
          </Paper>
        </Grid>
        {composter.lat && composter.lng && (
          <Grid item md={4} xs={12}>
            <Paper className={classes.map}>
              <MapField record={composter} />
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  )
}

const ComposterDetail = ({ composter }) => {
  return (
    <ComposterContainer composter={composter}>
      <Head>
        <title>{composter.name} - un composteur géré par Compostri</title>
      </Head>
      <Content />
    </ComposterContainer>
  )
}

const propTypes = { composter: composterType.isRequired }

ComposterDetail.propTypes = propTypes

ComposterDetail.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterDetail
