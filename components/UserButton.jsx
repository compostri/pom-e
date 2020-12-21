import React, { useState, useRef, useContext } from 'react'
import { makeStyles } from '@material-ui/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button, Popper, List, ListItem, ListItemText, ListItemIcon, Collapse, Box, Grow, Hidden, IconButton } from '@material-ui/core'
import { Lens, ExpandMore, ExpandLess, AccountCircle } from '@material-ui/icons'
import { UserContext } from '~/context/UserContext'
import palette from '~/variables'

const useStyles = makeStyles(theme => ({
  UserButtonLog: {
    '&:hover': {
      backgroundColor: palette.redOpacity
    }
  },
  popper: {
    zIndex: theme.zIndex.appBar
  },
  menu: {
    borderRadius: 2,
    overflow: 'hidden',
    width: 222,
    marginTop: 5
  },
  nested: {
    paddingLeft: theme.spacing(1),
    backgroundColor: palette.redPrimary,
    color: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '1px',
    borderBottomColor: 'rgba(255,255,255,.7)',
    '&:last-child': {
      border: 0
    },
    '&:hover, &:focus': {
      backgroundColor: palette.redOpacity
    },
    '& span': {
      fontWeight: 700,
      color: '#fff'
    }
  },
  nestedSecondary: {
    borderBottomWidth: '.5px',
    borderBottomColor: 'rgba(255,255,255,.3)',
    borderBottomStyle: 'solid',
    backgroundColor: palette.redOpacity,
    fontWeight: 400,
    paddingLeft: theme.spacing(1),
    color: 'white',
    '&:hover': {
      backgroundColor: palette.redPrimary
    },
    '& span': {
      color: '#fff'
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

const UserButton = () => {
  const classes = useStyles()
  const { userContext } = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [openSubMenu, setOpenSubMenu] = useState(false)
  const anchorRef = useRef(null)
  const router = useRouter()

  const handleToggle = () => {
    setOpen(!open)
  }
  const handleClick = () => {
    setOpenSubMenu(!openSubMenu)
  }

  return userContext.isLoggedIn() ? (
    <>
      <Hidden>
        <Button
          onClick={handleToggle}
          color="secondary"
          ref={anchorRef}
          variant="contained"
          className={classes.UserButtonLog}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          Mon compte
        </Button>
      </Hidden>

      <Popper className={classes.popper} open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal>
        {({ TransitionProps }) => (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Grow {...TransitionProps} style={{ transformOrigin: 'center top' }} timeout={350}>
            <Box className={classes.menu}>
              <List disablePadding component="nav">
                <Link href="/profil" passHref>
                  <ListItem button className={classes.nested}>
                    <ListItemText>Mon Profil</ListItemText>
                  </ListItem>
                </Link>

                <ListItem button className={classes.nested} onClick={handleClick}>
                  <ListItemText>Mes composteurs</ListItemText>
                  <ListItemIcon>{openSubMenu ? <ExpandLess className={classes.arrow} /> : <ExpandMore className={classes.arrow} />}</ListItemIcon>
                </ListItem>
                <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {userContext.user.composters.map(c => (
                      <Link key={c.slug} href="/composteur/[slug]" as={`/composteur/${c.slug}`} passHref>
                        <ListItem button className={classes.nestedSecondary}>
                          <ListItemIcon className={classes.listIcon}>
                            <Lens className={classes.lens} />
                          </ListItemIcon>
                          <ListItemText>{c.name}</ListItemText>
                        </ListItem>
                      </Link>
                    ))}
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
            </Box>
          </Grow>
        )}
      </Popper>
    </>
  ) : (
    <Link href={{ pathname: '/connexion', query: { ref: router.asPath } }} passHref>
      <Button color="secondary" variant="contained" className={classes.UserButtonLog}>
        Se connecter
      </Button>
    </Link>
  )
}

export default UserButton
