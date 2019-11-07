import React from 'react'
import { Paper, Typography, Button, FormControlLabel, TextField, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'

const useStyle = makeStyles(theme => ({
  sectionProfil: {
    width: 800,
    padding: theme.spacing(5),
    marginLeft: 370,
    marginTop: 180,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  buttonSubmit: {
    display: 'block',
    margin: '20px auto 0',
    color: 'white'
  },
  newsletter: {
    padding: 10,
    top: 70
  },
  title: {
    top: 15,
    left: 15,
    marginBottom: 15
  },
  info: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between'
  },

  second: {
    marginLeft: '2%',
    marginRight: 'auto'
  },
  form: {
    width: '100%'
  },
  input: {
    width: '48%',
    marginBottom: theme.spacing(2),
    marginRight: '2%'
  }
}))

const Profil = () => {
  const classes = useStyle()

  return (
    <>
      <Paper className={classes.sectionProfil}>
        <form className={classes.form}>
          <Typography className={classes.title}>Informations personnelles</Typography>
          <div className={classes.info}>
            <TextField fullWidth className={classes.input} id="nom" label="NOM" defaultValue="Entrez votre nom ici" />
            <TextField className={classNames(classes.input, classes.second)} fullWidth id="prenom" label="PRÉNOM" defaultValue="Entrez votre prénom ici" />
          </div>

          <div className={classes.info}>
            <TextField fullWidth className={classes.input} id="email" label="E-MAIL" defaultValue="Entrez votre e-mail ici" />

            <TextField
              className={classNames(classes.input, classes.second)}
              fullWidth
              id="mdp"
              label="MOT DE PASSE"
              type="password"
              defaultValue="Entrez votre mot de passe ici"
            />
          </div>
          <FormControlLabel
            className={classes.newsletter}
            value="newsletter"
            label="S'abonner à la newsletter"
            control={<Switch color="primary" />}
            labelPlacement="end"
          />

          <Button className={classes.buttonSubmit} type="submit" variant="contained" color="primary">
            Modifier mes informations
          </Button>
        </form>
      </Paper>
    </>
  )
}

export default Profil
