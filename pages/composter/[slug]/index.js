import React from 'react'
import Link from 'next/link'
import api from '~/utils/api'
import { Paper, Typography, Button, List, ListItem, ListItemText, ListItemIcon, InputBase, InputLabel, FormControl } from '@material-ui/core'
import { Room, Person, RadioButtonChecked, Lock, WatchLater } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '~/variables'
import ComposterContainer from '~/components/ComposterContainer'
import MapField from '~/components/MapField'

const useStyles = makeStyles(theme => ({
  sectionDetail: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  info: {
    display: 'flex',
    padding: theme.spacing(2, 2, 2, 2),
    marginBottom: theme.spacing(2)
  },
  infoRight: {
    marginLeft: theme.spacing(2)
  },
  titleSectionSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.greyDark,
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
    padding: theme.spacing(2, 2, 2, 2)
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: '400',
    color: palette.greyMedium,
    margin: '0'
  },
  contactezNous: {
    padding: theme.spacing(2, 2, 2, 2)
  },
  submit: {
    color: 'white',
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  },
  inputGlobal: {
    margin: theme.spacing(1, 0, 2, 0)
  },
  input: {
    marginTop: theme.spacing(2)
  },
  map: {
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    overflow: 'hidden'
  }
}))

const Content = ({ composter }) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.sectionDetail}>
        <div className={classes.sectionLeft}>
          <Paper className={classes.info}>
            <div>
              {' '}
              <img src="https://via.placeholder.com/150" />
            </div>
            <div className={classes.infoRight}>
              <Typography className={classes.titleSectionSecondary} variant="h2">
                Informations sur le site de compostage
              </Typography>
              <Link href="/composter/[slug]/modifications" as={`/composter/${composter.slug}/modifications`} passHref>
                <Button>Modifications</Button>
              </Link>
              <List className={classes.infoList}>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Room className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText className={classes.listItem}>
                    {' '}
                    <Typography className={classes.infoTxt} paragraph>
                      {composter.address}{' '}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <RadioButtonChecked className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt} paragraph>
                      {' '}
                      Quartier
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Person className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt}> Accepte de nouveau adhérents </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Lock className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt}> En service </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <WatchLater className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt}> Permanences : mercredi de 18h30 à 19h00 et samedi de 11h30 à 12h00 </Typography>
                  </ListItemText>
                </ListItem>
              </List>
            </div>
          </Paper>

          <Paper elevation={1} className={classes.contactezNous}>
            <Typography className={classes.titleSectionSecondary} variant="h2">
              Contactez-nous pour toutes vos questions
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
              <FormControl fullWidth className={classes.inputGlobal}>
                <InputLabel className={classes.label}>VOTRE E-MAIL</InputLabel>
                <InputBase fullWidth className={classes.input} defaultValue="Entrez votre adresse e-mail" inputProps={{ 'aria-label': 'naked' }} />
              </FormControl>
              <FormControl fullWidth className={classes.inputGlobal}>
                <InputLabel className={classes.label}>VOTRE MESSAGE</InputLabel>
                <InputBase fullWidth className={classes.input} defaultValue="Entrez votre message" inputProps={{ 'aria-label': 'naked' }} />
              </FormControl>
              <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                Envoyer
              </Button>
            </form>
          </Paper>
        </div>
        {composter.lat && composter.lng && (
          <Paper className={classes.map}>
            <MapField record={composter} />
          </Paper>
        )}
      </div>
    </>
  )
}

const ComposterDetail = ({ composter }) => {
  return (
    <ComposterContainer composter={composter}>
      <Content composter={composter} />
    </ComposterContainer>
  )
}

ComposterDetail.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterDetail
