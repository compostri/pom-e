import React from 'react'
import { Paper, Button, FormControlLabel, TextField, Switch, Tabs, Tab, Container, Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import palette from '../variables'

const useStyle = makeStyles(theme => ({
  sectionProfil: {
    padding: theme.spacing(2, 5, 5, 5),
    margin: theme.spacing(10, 15)
  },
  buttonSubmit: {
    display: 'block',
    margin: '25px auto 0',
    padding: theme.spacing(2)
  },
  newsletter: {
    padding: 4,
    top: 70,
    color: palette.greyLight,
    display: 'block'
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
    marginRight: '2%',
    fontSize: '1.1em'
  },
  appBar: {
    alignItems: 'baseline',
    justifyContent: 'flex-start',
    marginBottom: '2%'
  },
  tab: {
    textTransform: 'none',
    fontSize: 16,
    color: palette.greyDark
  },
  inputConfirmMdp: {
    justifySelf: 'flex-end'
  },
  inputAncienMdp: {
    width: '47%'
  }
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography component="div" role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`
  }
}

const Profil = () => {
  const classes = useStyle()
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Container maxWidth="lg">
      <Paper className={classes.sectionProfil}>
        <Tabs value={value} onChange={handleChange} className={classes.appBar} indicatorColor="primary">
          <Tab className={classes.tab} label="Informations personnelles" {...a11yProps(0)} />
          <Tab className={classes.tab} label="Mot de passe" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <form className={classes.form}>
            <div className={classes.info}>
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                className={classes.input}
                id="nom"
                label="Nom"
                placeholder="Entrez votre nom ici"
              />
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                className={classNames(classes.input, classes.second)}
                fullWidth
                id="prenom"
                label="Prénom"
                placeholder="Entrez votre prénom ici"
              />
            </div>

            <div className={classes.info}>
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                className={classes.input}
                id="email"
                label="E-mail"
                placeholder="Entrez votre e-mail ici"
              />

              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                className={classNames(classes.input, classes.second)}
                id="username"
                label="Pseudo"
                placeholder="Entrez votre pseudo ici"
              />
            </div>
            <FormControlLabel
              className={classes.newsletter}
              value="newsletterComposteur"
              label="S'abonner à la newsletter du composteur"
              control={<Switch color="primary" />}
              labelPlacement="end"
            />

            <FormControlLabel
              className={classes.newsletter}
              value="newsletter"
              label="S'abonner à la newsletter de Compostri"
              control={<Switch color="primary" />}
              labelPlacement="end"
            />

            <Button className={classes.buttonSubmit} type="submit" variant="contained" color="primary">
              Modifier mes informations
            </Button>
          </form>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <form className={classes.form}>
            <div className={classes.info}>
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                fullWidth
                className={classNames(classes.input, classes.inputAncienMdp)}
                id="lastMdp"
                type="password"
                label="Ancien mot de passe"
                placeholder="Entrez votre ancien mot de passe"
              />
            </div>
            <div className={classes.info}>
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                className={classes.input}
                id="newMdp"
                type="password"
                label="Nouveau mot de passe"
                placeholder="Entrez votre nouveau mot de passe"
              />
              <TextField
                InputLabelProps={{
                  shrink: true
                }}
                placeholder="Confirmez votre nouveau mot de passe"
                fullWidth
                className={classNames(classes.inputConfirmMdp, classes.second, classes.input)}
                id="confirmNewMdp"
                type="password"
                label="Confirmer mon mot de passe"
              />
            </div>
            <Button className={classes.buttonSubmit} type="submit" variant="contained" color="primary">
              Enregistrer le nouveau mot de passe
            </Button>
          </form>
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default Profil
