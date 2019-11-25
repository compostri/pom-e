import React, { useState, useEffect } from 'react'
import { Typography, IconButton, Button, Modal, Tabs, Tab, Paper, TextField, Box, InputBase, CircularProgress, Grid } from '@material-ui/core'
import { Clear, Search } from '@material-ui/icons'
import nextCookie from 'next-cookies'
import { makeStyles } from '@material-ui/styles'

import api from '~/utils/api'
import ComposterContainer from '~/components/ComposterContainer'
import OuvreurCard from '../../../components/OuvreurCard'
import palette from '~/variables'

const useStyles = makeStyles(theme => ({
  btnAdd: {
    margin: '0 auto',
    display: 'block'
  },
  btnNew: {
    marginTop: theme.spacing(4)
  },
  modal: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPaper: {
    padding: theme.spacing(6, 6, 6, 6),
    outline: 'none',
    maxWidth: 840
  },
  modalHeader: {
    display: 'flex',

    paddingBottom: theme.spacing(4)
  },
  tabs: {
    flexGrow: '1'
  },
  tab: {
    fontSize: 16,
    padding: 0,
    marginRight: theme.spacing(3)
  },
  modalFermer: {
    padding: '0'
  },
  info: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  },
  second: {
    marginLeft: '2%'
  },
  smallTxt: {
    color: palette.greyMedium,
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingTop: theme.spacing(2)
  },
  box: {
    padding: 0
  },
  search: {
    display: 'flex'
  },
  searchInput: {
    flexGrow: 1,
    backgroundColor: palette.greenPrimary,
    color: 'white'
  },
  searchBtn: {
    color: 'white',
    backgroundColor: palette.greenPrimary,
    borderRadius: 0,
    marginLeft: 1
  },
  searchResult: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2),
    color: palette.greyMedium,
    fontSize: 14,
    marginTop: theme.spacing(1)
  }
}))

const Content = ({ composter, users }) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const [activeTab, setActiveTab] = useState('creation-compte')
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleOpen = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }
  const handleSubmit = () => {
    // TODO Ajouter l'ouvreur a la permanence
    handleClose()
  }
  return (
    <>
      <div>
        <Typography variant="h1">Liste d&apos;ouvreurs pour {composter.name}</Typography>
        {!users ? (
          <Box align="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Box my={2}>
            <Grid container spacing={2}>
              {users.length > 0 ? (
                <Grid item md={3} xs={6}>
                  {users.map((o, index) => (
                    <OuvreurCard uc={o} key={`ouvr-${index}`} />
                  ))}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <Typography>Aucun ouvreur pour le moment</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </div>
      <Button variant="contained" color="secondary" className={classes.btnAdd} onClick={handleOpen}>
        Ajouter un nouvel ouvreur
      </Button>
      <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={openModal} onClose={handleClose}>
        <Paper elevation={1} className={classes.modalPaper}>
          <div className={classes.modalHeader}>
            <Tabs
              className={classes.tabs}
              value={activeTab}
              indicatorColor="primary"
              textColor="primary"
              onChange={event => setActiveTab(event.currentTarget.id)}
              aria-label="Ajout d'un compte ouvreur"
            >
              <Tab className={classes.tab} label="Création d'un compte" id="creation-compte" value="creation-compte" aria-controls="creation-compte-content" />
              <Tab
                className={classes.tab}
                label="Recherche d'un compte existant"
                id="recherche-compte"
                value="recherche-compte"
                aria-controls="recherche-compte-content"
              />
            </Tabs>

            <IconButton className={classes.modalFermer} onClick={handleClose}>
              <Clear />
            </IconButton>
          </div>
          <Box
            p={3}
            className={classes.box}
            role="tabpanel"
            hidden={activeTab !== 'creation-compte'}
            id="creation-compte-content"
            aria-labelledby="creation-compte"
          >
            <div className={classes.info}>
              <TextField fullWidth id="nom" label="Nom" placeholder="Entrez le nom ici" />
              <TextField className={classes.second} fullWidth id="prenom" label="Prénom" placeholder="Entrez le prénom ici" />
            </div>
            <div className={classes.info}>
              <TextField fullWidth id="pseudo" label="Pseudo" placeholder="Entrez le pseudo ici" />
              <TextField className={classes.second} fullWidth id="mail" label="E-mail" placeholder="Entrez l'e-mail ici" />
            </div>
            <Button variant="contained" onClick={handleSubmit} color="secondary" className={[classes.btnAdd, classes.btnNew].join(' ')}>
              Créer un compte pour ce composteur
            </Button>
            <Typography className={classes.smallTxt}>Attention ! L’ouvreur devra accepté l’invitation via mail avant d’être actif.</Typography>
          </Box>
          <Box
            p={3}
            className={classes.box}
            role="tabpanel"
            hidden={activeTab !== 'recherche-compte'}
            id="recherche-compte-content"
            aria-labelledby="recherche-compte"
          >
            <div className={classes.search}>
              <InputBase className={classes.searchInput} placeholder="Rechercher un utilisateur" />
              <IconButton className={classes.searchBtn} type="submit" aria-label="search">
                <Search />
              </IconButton>
            </div>
            <div className={classes.searchResult}>
              <Typography>{'arnaudban@matierenoire.io'}</Typography>
            </div>

            <Button variant="contained" color="secondary" onClick={handleSubmit} className={[classes.btnAdd, classes.btnNew].join(' ')}>
              Associer ce compte à ce composteur
            </Button>
            <Typography className={classes.smallTxt}>Attention ! L’ouvreur devra accepté l’invitation via mail avant d’être actif.</Typography>
          </Box>
        </Paper>
      </Modal>
    </>
  )
}

const ComposterOuvreurs = ({ composter }) => {
  const [users, setUsers] = useState()

  useEffect(() => {
    const getUsers = async () => {
      const res = await api.getUserComposter({ composter: composter.rid })
      if (res.data) {
        setUsers(res.data['hydra:member'])
      }
    }
    getUsers()
  }, [])

  return (
    <ComposterContainer composter={composter}>
      <Content composter={composter} users={users} />
    </ComposterContainer>
  )
}

ComposterOuvreurs.getInitialProps = async ctx => {
  const res = await api.getComposter(ctx.query.slug)
  const composter = res.data

  return {
    composter
  }
}

export default ComposterOuvreurs
