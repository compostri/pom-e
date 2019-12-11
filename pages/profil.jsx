import React from 'react'
import { Paper, Tabs, Tab, Container, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Head } from 'next/head'

import palette from '../variables'
import ProfileForm from '~/components/forms/ProfileForm'
import NotificationsForm from '~/components/forms/NotificationsForm'
import PasswordForm from '~/components/forms/PasswordForm'
import Header from '~/components/Header'

const useStyle = makeStyles(theme => ({
  sectionProfil: {
    padding: theme.spacing(2, 5, 5, 5),
    margin: theme.spacing(10, 15)
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
  }
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Box role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      <Box p={3}>{children}</Box>
    </Box>
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

  function handleChange(e, targetValue) {
    setValue(targetValue)
  }

  return (
    <>
      <Head>
        <title>Mon profil - Compstri</title>
      </Head>
      <Header title="Mon profil" />
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
            <PasswordForm />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <NotificationsForm />
          </TabPanel>
        </Paper>
      </Container>
    </>
  )
}

export default Profil
