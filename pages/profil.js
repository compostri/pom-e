import React from 'react'
import { Paper, Typography, FormControl, InputLabel, InputBase, Button, Radio, FormControlLabel, TextField, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

const useStyle = makeStyles(theme => ({
  sectionProfil: {
    display: 'flex',
    width: '800px',
    height: '400px',
    padding: (80, 50),
    marginLeft: 370,
    marginTop: 180
  },
  buttonSubmit: {
    right: 60,
    top: 60,
    width: '270px',
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
  container: {
    margin: theme.spacing(50)
  },
  infoLeft: {
    float: 'left',
    width: '48%'
  },
  infoRight: {
    float: 'right',
    width: '48%'
  },
  nom: {
    marginBottom: 10
  },
  email: {
    marginBottom: 10
  }
}))

const Profil = () => {
  const classes = useStyle()

  return (
    <>
      <Paper className={classes.sectionProfil}>
        <form>
          <Typography className={classes.title}>Informations personnelles</Typography>
          <div className={classes.infoLeft}>
            <TextField className={classes.nom} fullWidth id="nom" label="NOM" defaultValue="Entrez votre nom ici" />
            <TextField fullWidth id="prenom" label="PRÉNOM" defaultValue="Entrez votre prénom ici" />
          </div>

          <div className={classes.infoRight}>
            <TextField className={classes.email} fullWidth id="email" label="E-MAIL" defaultValue="Entrez votre e-mail ici" />

            <TextField fullWidth id="mdp" label="MOT DE PASSE" type="password" defaultValue="Entrez votre mot de passe ici" />
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
