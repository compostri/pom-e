import React, { useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/styles'
import palette from '../variables'
import { Paper, Typography, IconButton, Modal, FormControl, Select, MenuItem, InputLabel, Button } from '@material-ui/core'
import { Add, Clear, TrendingUp } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import { setNormalizedScrollLeft } from 'normalize-scroll-left'
dayjs.locale('fr')

const useStyles = makeStyles(theme => ({
  card: {
    width: 310,
    marginBottom: theme.spacing(3),
    borderBottom: '3px solid',
    padding: theme.spacing(2, 2, 2, 2)
  },
  cardGrey: {
    borderBottomColor: palette.greyLight
  },
  cardBlue: {
    borderBottomColor: palette.blue
  },
  cardOrange: {
    borderBottomColor: palette.orangePrimary
  },
  cardGreen: {
    borderBottomColor: palette.greenPrimary
  },
  ouvreurList: {
    display: 'flex',
    flexWrap: 'Wrap',
    marginTop: theme.spacing(1)
  },
  date: {
    color: palette.greyDark,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'capitalize'
  },
  ouvreur: {
    display: 'flex',
    flexWrap: 'Wrap',
    flexGrow: '1',
    marginTop: theme.spacing(1)
  },
  ouvreurAvatar: {
    marginRight: theme.spacing(1),
    borderRadius: 100,
    width: 30,
    height: 30,
    textAlign: 'center',
    paddingTop: 4,
    fontSize: 14,
    fontWeight: '700',
    '&:hover': {
      border: '1px solid'
    }
  },
  ouvreurAvatarGreen: {
    backgroundColor: palette.greenOpacity,
    color: palette.greenPrimary,
    '&:hover': {
      borderColor: palette.greenPrimary
    }
  },
  ouvreurAvatarGrey: {
    backgroundColor: palette.greyExtraLight,
    color: palette.greyMedium,
    '&:hover': {
      borderColor: palette.greyMedium
    }
  },
  ouvreurAvatarOrange: {
    backgroundColor: 'rgba(232, 96, 52, 0.2)',
    color: palette.orangePrimary,
    marginTop: 0,
    '&:hover': {
      borderColor: palette.orangePrimary
    }
  },
  ouvreurAvatarBlue: {
    backgroundColor: 'rgba(123, 206, 209, 0.2)',
    color: palette.blue,
    '&:hover': {
      borderColor: palette.blue
    }
  },
  ouvreurName: {
    color: palette.greyMedium,
    fontSize: 14,
    fontWeight: '400',
    marginTop: 4,
    marginRight: theme.spacing(3)
  },
  ouvreurNameOrange: {
    color: palette.orangePrimary
  },
  addOuvreur: {
    marginTop: theme.spacing(1)
  },
  addOuvreurBtn: {
    backgroundColor: palette.greyExtraLight,
    color: palette.greyMedium
  },
  modal: {
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalPaper: {
    height: 290,
    width: 546,
    padding: theme.spacing(6, 6, 6, 6),
    outline: 'none'
  },
  modalHeader: {
    display: 'flex',
    paddingBottom: theme.spacing(4)
  },
  modalTitle: {
    color: palette.greyDark,
    fontSize: 20,
    fontWeight: '700',
    flexGrow: '1'
  },
  modalFermer: {
    padding: '0'
  },
  formOuvreurs: {
    margin: '0 auto',
    display: 'block'
  },
  btnAdd: {
    height: 47,
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    backgroundColor: palette.orangePrimary,
    margin: '0 auto',
    display: 'block',
    marginTop: theme.spacing(4),
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  }
}))

const PermanenceCard = ({ permanence, users }) => {
  const classes = useStyles()
  const [openModal, setOpenModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')

  const handleOpen = () => {
    setOpenModal(true)
  }
  const handleClose = () => {
    setOpenModal(false)
  }

  const handleChange = event => {
    setSelectedUser(event.target.value)
  }
  const handleSubmit = () => {
    // TODO Ajouter l'ouvreur a la permanence
    handleClose()
  }

  let statutClasses = classes.cardGreen
  let statutClassesAvatar = classes.ouvreurAvatarGreen

  if (dayjs(permanence.date).isBefore(dayjs())) {
    statutClasses = classes.cardGrey
    statutClassesAvatar = classes.ouvreurAvatarGrey
  } else if (permanence.message.length > 0) {
    statutClasses = classes.cardBlue
    statutClassesAvatar = classes.ouvreurAvatarBlue
  } else if (permanence.ouvreur.length == 0) {
    statutClasses = classes.cardOrange
    statutClassesAvatar = classes.ouvreurAvatarOrange
  }

  return (
    <Paper elevation={1} className={[classes.card, statutClasses].join(' ')}>
      <Typography className={classes.date}>{dayjs(permanence.date).format('dddd YY[,] hh[h]mm')}</Typography>
      <div className={classes.ouvreurList}>
        <div className={classes.ouvreur}>
          {permanence.ouvreur.length > 0 ? (
            permanence.ouvreur.map((ouvreur, index) => (
              <Fragment key={`ouvreur-${permanence.date}-${index}`}>
                <div className={[classes.ouvreurAvatar, statutClassesAvatar].join(' ')}>{ouvreur[0]}</div>
                <Typography className={classes.ouvreurName} key={ouvreur}>
                  {ouvreur}
                </Typography>
              </Fragment>
            ))
          ) : (
            <>
              <p className={[classes.ouvreurAvatar, statutClassesAvatar].join(' ')}>?</p>
              <Typography paragraph className={[classes.ouvreurName, classes.ouvreurNameOrange].join(' ')}>
                Pas d'ouvreur
              </Typography>
            </>
          )}
        </div>
        <div className={classes.addOuvreur}>
          <IconButton className={[classes.ouvreurAvatar, classes.addOuvreurBtn].join(' ')} onClick={handleOpen}>
            <Add />
          </IconButton>
          <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={openModal} onClose={handleClose}>
            <Paper elevation={1} className={classes.modalPaper}>
              <div className={classes.modalHeader}>
                <Typography variant="h1" className={classes.modalTitle}>
                  Ajouter de nouveaux ouvreurs
                </Typography>
                <IconButton className={classes.modalFermer} onClick={handleClose}>
                  <Clear />
                </IconButton>
              </div>
              <FormControl className={classes.formOuvreurs}>
                <InputLabel shrink id="liste-ouvreurs">
                  LISTE DES OUVREURS
                </InputLabel>
                <Select fullWidth id="liste-ouvreurs" labelId="liste-ouvreurs-label" displayEmpty value={selectedUser} onChange={handleChange}>
                  <MenuItem value="">Choisissez un ouvreur</MenuItem>
                  {users['hydra:member'].map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={handleSubmit} fullWidth className={classes.btnAdd}>
                Ajouter
              </Button>
            </Paper>
          </Modal>
        </div>
      </div>
    </Paper>
  )
}
export default PermanenceCard
