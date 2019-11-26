import React, { useContext, useEffect } from 'react'
import { Paper, FormControlLabel, Switch, Typography } from '@material-ui/core'
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
    textAlign: 'center',
    fontSize: 17,
    margin: theme.spacing(3)
  },
  composterUc: {
    background: palette.greyExtraLight,
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    borderRadius: 2
  },
  composters: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center' },
  composterName: {
    textAlign: 'center',
    margin: theme.spacing(1, 0, 2)
  },
  newsCompostri: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    color: palette.greyLight
  }
}))

const NotificationsForm = () => {
  const classes = useStyle()
  const { addToast } = useToasts()

  const { userContext } = useContext(UserContext)
  const [userComposter, setUserComposter] = React.useState([])

  /* Notifications */
  async function getUserComposter() {
    const dataComposters = await api.getUserComposter({ user: userContext.user.id })

    if (dataComposters.status === 200) {
      setUserComposter(dataComposters.data['hydra:member'])
    }
  }

  const updateNotif = (uc, field) => {
    const newUCs = userComposter.map(oldUC => {
      if (oldUC['@id'] === uc['@id']) {
        return { ...uc, [field]: !uc[field] }
      } else {
        return oldUC
      }
    })
    setUserComposter(newUCs)
  }

  useEffect(() => {
    getUserComposter()
  }, [])

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

      <div className={classes.composters}>
        {userComposter.length > 0 &&
          userComposter.map((uc, index) => {
            return (
              <Paper className={classes.composterUc} key={`uc-${index}`}>
                <Typography className={classes.composterName} component="h3" variant="h3">
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
            )
          })}
      </div>
    </>
  )
}

export default NotificationsForm
