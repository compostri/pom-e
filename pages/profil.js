import React, { useContext, useEffect } from 'react'
import { Paper, Button, FormControlLabel, TextField, Switch, Tabs, Tab, Container, Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import classNames from 'classnames'
import palette from '../variables'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import { UserContext } from '~/context/UserContext'
import api from '~/utils/api'
import ProfileForm from '~/components/forms/ProfileForm'
import NotificationsForm from '~/components/forms/NotificationsForm'

const UpdateProfil = Yup.object().shape({
  lastname: Yup.string().required('Nom requis'),
  firstname: Yup.string().required('Prénom requis'),
  email: Yup.string()
    .email('Email non valide')
    .required('Email requis'),
  username: Yup.string().required('Pseudo requis')
})
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
  const [isUpdateSuccess, setUpdateStatus] = React.useState(false)
  const [user, setUser] = React.useState({ username: '', lastname: '', firstname: '', email: '' })
  const { userContext } = useContext(UserContext)

  async function getUser(values) {
    const data = await userContext.getUser(values).catch(console.log)
    if (data) {
      const { username, firstname, lastname, email } = data
      setUser({ username, firstname, lastname, email })
    }
  }

  useEffect(() => {
    getUser()
  }, [isUpdateSuccess])
  /* console.log(userContext.isLoggedIn()) */
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const FormikTextField = ({ field, form, ...props }) => {
    return <TextField {...field} {...props} />
  }
  const handleSubmit = async values => {
    const res = await userContext.updateUser(values)
    console.log(values)
    if (res.data === 200) {
      setUpdateStatus(true)
    } else {
      setUpdateStatus(false)
    }
  }
  return (
    <Container maxWidth="lg">
      <Paper className={classes.sectionProfil}>
        <Tabs value={value} onChange={handleChange} className={classes.appBar} indicatorColor="primary">
          <Tab className={classes.tab} label="Informations personnelles" {...a11yProps(0)} />
          <Tab className={classes.tab} label="Mot de passe" {...a11yProps(1)} />
          <Tab className={classes.tab} label="Notifications" {...a11yProps(2)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ProfileForm />
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
        <TabPanel value={value} index={2}>
          <NotificationsForm />
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default Profil
