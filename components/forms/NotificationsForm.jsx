import React, { useContext, useEffect, useCallback } from 'react'
import { Paper, FormControlLabel, Switch, Typography, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { useToasts, TOAST } from '~/components/Snackbar'
import { UserContext } from '~/context/UserContext'
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

const NotificationsForm = () => {
  const classes = useStyle()
  const { addToast } = useToasts()

  const { userContext } = useContext(UserContext)
  const [userComposter, setUserComposter] = React.useState([])

  /* Notifications */
  const getUserComposter = useCallback(async () => {
    const data = await api.getUserComposter({ user: userContext.user.userId }).catch(console.error)
    if (data) {
      setUserComposter(data['hydra:member'])
    }
  }, [userContext.user.userId])

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
    getUserComposter()
  }, [getUserComposter])

  /* Update Notifications */
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
        value="newsletterCompostri"
        label="S'abonner à la newsletter de Compostri"
        control={<Switch color="primary" />}
        labelPlacement="end"
      />
      <Typography component="h2" variant="h2" className={classes.titles}>
        Mes composteurs
      </Typography>

      <Grid container spacing={2}>
        {userComposter.length > 0 &&
          userComposter.map((uc, index) => {
            return (
              <Grid item xs={6} key={`uc-${uc.id}`}>
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

export default NotificationsForm
