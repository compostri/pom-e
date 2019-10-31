import React, { useState, useRef, useContext } from 'react'
import { UserContext } from '../context/UserContext'
import { makeStyles } from '@material-ui/styles'
import palette from '../variables'
import Link from 'next/link'
import { Button, Popper, List, ListItem, ListItemText, ListItemIcon, Collapse } from '@material-ui/core'
import { Lens } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'white',
    shadowColor: palette.greyMedium,
    shadowOffset: { width: 1, height: 0 },
    shadowRadius: 2
  },
  logo: {
    width: 80,
    height: 175,
    backgroundColor: palette.greenPrimary,
    borderRadius: '0'
  },
  logoSvg: {
    display: 'Block',
    margin: '0 auto',
    paddingBottom: theme.spacing(8)
  },
  toolbarGlobal: {
    alignItems: 'flex-end'
  },
  toolbarTitle: {
    display: 'flex'
  },
  toolbarLeft: {
    flexGrow: '1',
    marginLeft: theme.spacing(2)
  },
  chevronLeft: {
    padding: '0'
  },
  UserButtonLog: {
    alignSelf: 'center',
    margin: theme.spacing(0, 5, 8, 0)
  },
  title: {
    color: palette.greyDark,
    fontSize: '28px',
    fontWeight: '700'
  },
  button: {
    color: palette.greyDark,
    fontSize: '16px',
    fontWeight: '400',
    borderBottomStyle: 'solid',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    padding: theme.spacing(6, 0, 3, 0),
    marginRight: theme.spacing(4),
    '&:hover': {
      borderBottomColor: palette.greenPrimary,
      backgroundColor: 'white'
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
          className={(classes.userButton, classes.UserButtonLog)}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          Mon compte
        </Button>

        <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal>
          <List component="nav">
            <ListItem button className={classes.nested}>
              <ListItemTexts primary="Mon Profil" />
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
            <ListItem button className={classes.nested}>
              <ListItemText primary="Se déconnecter" />
            </ListItem>
          </List>
        </Popper>
      </>
    )
  } else {
    return (
      <Link href="/connexion" as={'/connexion'} passHref>
        <Button color="secondary" variant="contained" className={classes.userButton}>
          Se connecter
        </Button>
      </Link>
    )
  }

  return
}
