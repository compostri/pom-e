import React, { useState, Fragment } from 'react'
import { makeStyles } from '@material-ui/styles'
import palette from '~/variables'
import { Paper, Typography, IconButton, Modal, FormControl, Select, MenuItem, InputLabel, Button } from '@material-ui/core'
import { Add, Clear, TrendingUp } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  card: {
    width: 310,
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2, 2, 2, 2)
  },
  ouvreurList: {
    display: 'flex',
    flexWrap: 'Wrap',
    marginTop: theme.spacing(1)
  },
  ouvreur: {
    marginTop: theme.spacing(1),
    width: '100%'
  },
  ouvreurAvatar: {
    margin: '0 auto',
    display: 'block',
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
  ouvreurInfo: {
    color: palette.greyMedium,
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center'
  },
  ouvreurName: {
    fontWeight: '700'
  },
  supprOuvreur: {
    backgroundColor: palette.greenOpacity,
    color: palette.greenPrimary,
    fontWeight: '700',
    margin: '0 auto',
    display: 'block',
    border: '1px solid',
    borderColor: 'transparent',
    marginTop: theme.spacing(1),
    '&:hover': {
      borderColor: palette.greenPrimary,
      backgroundColor: palette.greenOpacity
    }
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
  },
  modalUser: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2),
    display: 'flex'
  },
  modalUserName: {
    color: palette.greyMedium,
    fontSize: 14,
    padding: (5, 0, 0, 5)
  },
  modalAvatar: {
    borderRadius: 100,
    width: 30,
    height: 30,
    textAlign: 'center',
    paddingTop: 4,
    fontSize: 14,
    fontWeight: '700'
  }
}))

const OuvreurCard = ({ ouvreur, users }) => {
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

  return (
    <Paper elevation={1} className={[classes.card, statutClasses].join(' ')}>
      <div className={classes.ouvreurList}>
        <div className={classes.ouvreur}>
          {ouvreur.name.map((name, index) => (
            <Fragment key={`ouvreur-${ouvreur.name}-${index}`}>
              <div className={[classes.ouvreurAvatar, statutClassesAvatar].join(' ')}>{name[0]}</div>
              <Typography className={[classes.ouvreurInfo, classes.ouvreurName].join(' ')} key={name}>
                {name}
              </Typography>
              <Typography className={classes.ouvreurInfo}>arnaudban@matierenoire.io</Typography>
            </Fragment>
          ))}
          <Button className={classes.supprOuvreur} onClick={handleOpen}>
            Supprimer de ce composteur
          </Button>
          <Modal BackdropProps={{ style: { background: '#faf9f8' } }} className={classes.modal} open={openModal} onClose={handleClose}>
            <Paper elevation={1} className={classes.modalPaper}>
              <div className={classes.modalHeader}>
                <Typography variant="h1" className={classes.modalTitle}>
                  Supprimer de ce composteur
                </Typography>
                <IconButton className={classes.modalFermer} onClick={handleClose}>
                  <Clear />
                </IconButton>
              </div>

              {ouvreur.name.map((name, index) => (
                <Fragment key={`ouvreur-${ouvreur.name}-${index}`}>
                  <div className={classes.modalUser}>
                    <div className={[classes.modalAvatar, statutClassesAvatar].join(' ')}>{name[0]}</div>
                    <Typography className={classes.modalUserName} key={name}>
                      {name}
                    </Typography>
                  </div>
                </Fragment>
              ))}

              <Button onClick={handleSubmit} fullWidth className={classes.btnAdd}>
                Confirmer
              </Button>
            </Paper>
          </Modal>
        </div>
      </div>
    </Paper>
  )
}
export default OuvreurCard
