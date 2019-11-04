import Link from 'next/link'
import React from 'react'
import api from '../../utils/api'
import { Paper, Typography, AppBar, Button, Toolbar, Popper, List, ListItem, ListItemText, ListItemIcon, Collapse, IconButton } from '@material-ui/core'
import { ExpandMore, ExpandLess, Lens, ChevronLeft } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '../../variables'
import { UserButton } from '../../components/UserButton'

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

const Header = ({ title }) => {
  const classes = useStyles()

  const [open, setOpen] = React.useState(false)
  const [openSubMenu, setOpenSubMenu] = React.useState(true)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen(open => !open)
  }
  const handleClick = () => {
    setOpenSubMenu(!openSubMenu)
  }

  return (
    <AppBar className={classes.appBar} position="static">
      <Toolbar className={classes.toolbarGlobal} disableGutters>
        <Link href="/" passHref>
          <IconButton className={classes.logo}>
            <img className={classes.logoSvg} src="/static/logo2.svg" />
          </IconButton>
        </Link>
        <div className={classes.toolbarLeft}>
          <div className={classes.toolbarTitle}>
            <Link href="/" passHref>
              <IconButton className={classes.chevronLeft}>
                <ChevronLeft />
              </IconButton>
            </Link>
            <Typography variant="h1" className={classes.title}>
              {title}
            </Typography>
          </div>
          <div className={classes.toolbarLink}>
            <Button className={classes.button}>Informations</Button>
            <Button className={classes.button}>Permanences</Button>
            <Button className={classes.button}>Stastiques</Button>
            <Button className={classes.button}>Listes d'ouvreurs</Button>
            <Button className={classes.button}>Newsletter</Button>
          </div>
        </div>

        <div className={(classes.userButton, classes.UserButtonLog)}>
          <UserButton />
        </div>
      </Toolbar>
    </AppBar>
  )
}
/**
 * 
 * 
DateInauguration: null
DateInstallation: null
DateMiseEnRoute: "2009-06-26T00:00:00+00:00"
address: "allée de la cité"
animation: 2
autonomie: 3
cadena: ""
commune: {@id: "/communes/2", @type: "Commune", id: 2, name: "Nantes"}
description: null
environnement: 3
id: 2
lat: 47.207748
lng: -1.540578
mc: {@id: "/users/7", @type: "User", id: 7, username: "samir@compostri.fr", email: "samir@compostri.fr"}
name: "Beaulieu"
pavilionsVolume: {@id: "/pavilions_volumes/1", @type: "PavilionsVolume", id: 1, volume: "20"}
pole: null
quartier: {@id: "/quartiers/17", @type: "Quartier", name: "Nantes Île-de-Nantes"}
shortDescription: ""
technique: 3

 * @param {*} param0 
 */
const Content = ({ composter }) => {
  return (
    <>
      <Paper>
        <Typography variant="h2">Informations sur le site de compostage</Typography>
        <Typography paragraph>{composter.address} </Typography>
        <Typography paragraph>{composter.quartier['@type']}</Typography>
      </Paper>
      <Paper>
        <Typography variant="h2">Contactez-nous pour toutes vos questions</Typography>
      </Paper>
    </>
  )
}

const ComposterDetail = ({ composter }) => {
  return (
    <>
      <Header title={composter.name} />
      <Content composter={composter} />
    </>
  )
}

ComposterDetail.getInitialProps = async ({ query }) => {
  const composter = await api.getComposter(query.slug)

  return {
    composter: composter.data
  }
}

export default ComposterDetail
