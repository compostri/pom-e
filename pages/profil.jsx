import React, { useContext } from 'react'
import { Paper, Tabs, Tab, Container, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Head from 'next/head'

import palette from '../variables'
import ProfileForm from '~/components/forms/ProfileForm'
import NotificationsForm from '~/components/forms/NotificationsForm'
import PasswordForm from '~/components/forms/PasswordForm'
import Header from '~/components/Header'
import withAuthGuard from '~/utils/hoc/withAuthGuard'
import { UserContext } from '~/context/UserContext'
import { TOAST, useToasts } from '~/components/Snackbar'
import WithUserPersistence from '~/utils/hoc/withUserPersistence'
import { userType } from '~/types'

const useStyle = makeStyles(theme => ({
  sectionProfil: {
    padding: theme.spacing(2, 5, 5, 5),
    margin: theme.spacing(10, 15),
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0),
      padding: theme.spacing(2)
    }
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

const propTypes = {
  persitentUser: userType.isRequired
}

const Profil = ({ persitentUser }) => {
  const { userId } = persitentUser
  const classes = useStyle()
  const { addToast } = useToasts()
  const {
    userContext: { updateUser }
  } = useContext(UserContext)

  const [value, setValue] = React.useState(0)

  function handleChange(e, targetValue) {
    setValue(targetValue)
  }

  const renderTabs = tabs => {
    const renderTab = (label, index) => <Tab key={label} className={classes.tab} label={label} id={`tab-${index}`} aria-controls={`tabpanel-${index}`} />
    return tabs.map(renderTab)
  }

  const handleUserUpdate = async values => {
    const { status } = await updateUser(values)

    return new Promise((resolve, reject) => {
      if (status === 200) {
        addToast('Les modifications ont bien été prise en compte.', TOAST.SUCCESS)
        resolve()
      } else {
        addToast('Une erreur a eu lieu', TOAST.ERROR)
        reject()
      }
    })
  }

  const renderTabPanels = (id, currentPanelValue) => {
    const panels = [
      <ProfileForm onUserInformationUpdate={handleUserUpdate} user={persitentUser} />,
      <PasswordForm onPasswordUpdate={handleUserUpdate} />,
      <NotificationsForm onUserInformationUpdate={handleUserUpdate} user={persitentUser} />
    ]

    const renderTabPanel = (Panel, index) => (
      <Box key={Panel.type.name} role="tabpanel" hidden={currentPanelValue !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
        <Box p={3}>{Panel}</Box>
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
          {renderTabPanels(userId, value)}
        </Paper>
      </Container>
    </>
  )
}

Profil.propTypes = propTypes

export default withAuthGuard(WithUserPersistence(Profil))
