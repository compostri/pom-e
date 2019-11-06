import React, { useState, useRef, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { makeStyles } from '@material-ui/styles'
import palette from '../variables'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Popper, List, ListItem, ListItemText, ListItemIcon, Collapse } from '@material-ui/core'
import { Lens, ExpandMore, ExpandLess } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  UserButtonLog: {
    alignSelf: 'center',
    margin: theme.spacing(0, 5, 8, 0),
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  },
  nested: {
    paddingLeft: theme.spacing(1),
    backgroundColor: palette.orangePrimary,
    color: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'white',
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  },
  nestedSecondary: {
    backgroundColor: palette.orangeOpacity,
    '&:hover': {
      backgroundColor: palette.orangePrimary
    }
  },
  arrow: {
    color: 'white'
  },
  lens: {
    width: '5px',
    color: 'white'
  },
  listIcon: {
    minWidth: '25px',
    paddingLeft: theme.spacing(1)
  }
}))

export const UserButton = props => {
  const classes = useStyles()
  const { userContext } = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(true)
  const anchorRef = useRef(null)
  const router = useRouter()

  const handleToggle = () => {
    setOpen(open => !open)
  }
  const handleClick = () => {
    setOpenSubMenu(!openSubMenu)
  }

  if (userContext.isLoggedIn()) {
    return (
      <>
        <Button
          onClick={handleToggle}
          color="secondary"
          ref={anchorRef}
          variant="contained"
          className={[classes.userButton, classes.UserButtonLog].join(' ')}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          Mon compte
        </Button>

        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal>
          <List component="nav">
            <ListItem button className={classes.nested}>
              <ListItemText primary="Mon Profil" />
            </ListItem>

            <ListItem button className={classes.nested} onClick={handleClick}>
              <ListItemText primary="Mes composteurs" />
              <ListItemIcon>{openSubMenu ? <ExpandLess className={classes.arrow} /> : <ExpandMore className={classes.arrow} />}</ListItemIcon>
            </ListItem>
            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={[classes.nested, classes.nestedSecondary].join(' ')}>
                  <ListItemIcon className={classes.listIcon}>
                    <Lens className={classes.lens} />
                  </ListItemIcon>
                  <ListItemText primary="Composteur 1" />
                </ListItem>
                <ListItem button className={[classes.nested, classes.nestedSecondary].join(' ')}>
                  <ListItemIcon className={classes.listIcon}>
                    <Lens className={classes.lens} />
                  </ListItemIcon>
                  <ListItemText primary="Composteur 2" />
                </ListItem>
              </List>
            </Collapse>
            <ListItem
              button
              className={classes.nested}
              onClick={() => {
                userContext.logout()
              }}
            >
              <ListItemText primary="Se déconnecter" />
            </ListItem>
          </List>
        </Popper>
      </>
    )
  } else {
    return (
      <Link href={{ pathname: '/login', query: { ref: router.asPath } }} passHref>
        <Button color="secondary" variant="contained" className={[classes.userButton, classes.UserButtonLog].join(' ')}>
          Se connecter
        </Button>
      </Link>
    )
  }

  return
}
