import React from 'react'
import { Paper, Tabs, Tab, Container, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Head from 'next/head'

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

const tabLabels = ['Informations personnelles', 'Mot de passe', 'Notifications']
const tabPanels = [ProfileForm, PasswordForm, NotificationsForm]

const Profil = () => {
  const classes = useStyle()
  const [value, setValue] = React.useState(0)

  function handleChange(e, targetValue) {
    setValue(targetValue)
  }

  const renderTabs = tabs => {
    const renderTab = (label, index) => <Tab key={label} className={classes.tab} label={label} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
    return tabs.map(renderTab)
  }

  const renderTabPanels = (panels, currentPanelValue) => {
    const renderTabPanel = (Panel, index) => (
      <Box key={Panel.name} role="tabpanel" hidden={currentPanelValue !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
        <Box p={3}>
          <Panel />
        </Box>
      </Box>
    )
    return panels.map(renderTabPanel)
  }

  return (
    <>
      <Head>
        <title>Mon profil - Compostri</title>
      </Head>
      <Header title="Mon profil" />
      <Container maxWidth="lg">
        <Paper className={classes.sectionProfil}>
          <Tabs value={value} onChange={handleChange} className={classes.appBar} indicatorColor="primary">
            {renderTabs(tabLabels)}
          </Tabs>
          {renderTabPanels(tabPanels, value)}
        </Paper>
      </Container>
    </>
  )
}

export default Profil
