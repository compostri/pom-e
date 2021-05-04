import React, { useEffect } from 'react'
import { Paper, FormControlLabel, Switch, Typography, Grid } from '@material-ui/core'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'
import { useToasts, TOAST } from '~/components/Snackbar'
import api from '~/utils/api'
import palette from '~/variables'

const useStyle = makeStyles(theme => ({
  newsletter: {
    color: palette.greyLight,
    display: 'block',
    margin: theme.spacing(1, 0)
  },

  titles: {
    fontSize: 17,
    margin: theme.spacing(0, 0, 3)
  },
  newsCompostri: {
    margin: theme.spacing(2, 0),
    display: 'flex',
    flexWrap: 'wrap',
    color: palette.greyLight
  },
  composters: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' },
  composterUc: {
    background: palette.greyExtraLight,
    padding: theme.spacing(2),
    borderRadius: 2
  },
  composterName: {
    textAlign: 'center',
    margin: theme.spacing(1, 0, 2)
  }
}))

const propTypes = {
  onUserInformationUpdate: PropTypes.func.isRequired,
  user: PropTypes.object
}

const NotificationsForm = ({ user, onUserInformationUpdate }) => {
  const classes = useStyle()
  const userId = user.userId
  const { addToast } = useToasts()

  const [userComposter, setUserComposter] = React.useState([])

  const updateNotif = (uc, field) => {
    const newUCs = userComposter.map(oldUC => {
      if (oldUC['@id'] === uc['@id']) {
        return { ...uc, [field]: !uc[field] }
      }
      return oldUC
    })
    setUserComposter(newUCs)
  }

  useEffect(() => {
    const getUserComposter = async () => {
      const data = await api.getUserComposter({ user: userId }).catch(console.error)
      if (data) {
        setUserComposter(data['hydra:member'])
      }
    }

    if (userId) {
      getUserComposter()
    }
  }, [userId])

  /* Update User Composteur */
  const updateUC = async (uc, field) => {
    updateNotif(uc, field)
    const res = await api.updateUserComposter(uc['@id'], { [field]: !uc[field] })
    if (res.error) {
      updateNotif(uc, field)
      addToast('Une erreur est intervenue. Veuillez rééssayer plus tard.', TOAST.ERROR)
    }
  }

  return (
    <>
      <Typography component="h2" variant="h2" className={classes.titles}>
        Général
      </Typography>
      <FormControlLabel
        className={classes.newsCompostri}
        name="newsletterCompostri"
        label="S'abonner à la newsletter de Compostri"
        control={<Switch color="primary" checked={user.isSubscribeToCompostriNewsletter} />}
        labelPlacement="end"
        onChange={() => onUserInformationUpdate({ isSubscribeToCompostriNewsletter: !user.isSubscribeToCompostriNewsletter })}
      />
      <Typography component="h2" variant="h2" className={classes.titles}>
        Mes composteurs
      </Typography>

      <Grid container spacing={2}>
        {userComposter.length > 0 &&
          userComposter.map(uc => {
            return (
              <Grid item xs={12} sm={6} key={`uc-${uc.id}`}>
                <Paper className={classes.composterUc}>
                  <Typography className={classes.composterName} component="h3" variant="h2">
                    {uc.composter.name}
                  </Typography>

                  <FormControlLabel
                    onChange={() => updateUC(uc, 'notif')}
                    className={classes.newsletter}
                    name="notif"
                    label="Être notifié lors de mes permanences"
                    control={<Switch value="notif" checked={uc.notif} color="primary" />}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={() => updateUC(uc, 'newsletter')}
                    className={classes.newsletter}
                    name="newsletter"
                    label="S'abonner à la newsletter du composteur"
                    control={<Switch value="newsletter" checked={uc.newsletter} color="primary" />}
                    labelPlacement="end"
                  />
                  <FormControlLabel
                    onChange={() => updateUC(uc, 'composterContactReceiver')}
                    className={classes.newsletter}
                    name="composterContactReceiver"
                    label="Recevoir les formulaires de contact"
                    control={<Switch value="composterContactReceiver" checked={uc.composterContactReceiver} color="primary" />}
                    labelPlacement="end"
                  />
                </Paper>
              </Grid>
            )
          })}
      </Grid>
    </>
  )
}

NotificationsForm.propTypes = propTypes

export default NotificationsForm
