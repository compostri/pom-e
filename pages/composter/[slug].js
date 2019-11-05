import Link from 'next/link'
import React from 'react'
import api from '../../utils/api'
import {
  Paper,
  Typography,
  AppBar,
  Button,
  Toolbar,
  Popper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  TextField,
  InputBase,
  InputLabel,
  FormControl
} from '@material-ui/core'
import { ExpandMore, ExpandLess, Lens, ChevronLeft, Room, Person, RadioButtonChecked, Lock, WatchLater } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import palette from '../../variables'
import { UserButton } from '../../components/UserButton'
import MapField from '../../components/MapField'

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: 'white'
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
  },
  sectionDetail: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: theme.spacing(2, 5, 2, 10)
  },
  info: {
    display: 'flex',
    padding: theme.spacing(2, 2, 2, 2),
    marginBottom: theme.spacing(2)
  },
  infoRight: {
    marginLeft: theme.spacing(2)
  },
  titleSectionSecondary: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.greyDark,
    paddingBottom: theme.spacing(2)
  },
  listItem: {
    padding: '0'
  },
  infoIcone: {
    color: palette.greenPrimary,
    width: '15px',
    padding: '0'
  },
  infoList: {
    backgroundColor: palette.greyExtraLight,
    padding: theme.spacing(2, 2, 2, 2)
  },
  infoTxt: {
    fontSize: 16,
    fontWeight: '400',
    color: palette.greyMedium,
    margin: '0'
  },
  contactezNous: {
    padding: theme.spacing(2, 2, 2, 2),
    marginBottom: theme.spacing(2)
  },
  submit: {
    color: 'white',
    '&:hover': {
      backgroundColor: palette.orangeOpacity
    }
  },
  inputGlobal: {
    margin: theme.spacing(1, 0, 2, 0)
  },
  input: {
    marginTop: theme.spacing(2)
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
    <AppBar className={classes.appBar} position="static" elevation={1}>
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

const Content = ({ composter }) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.sectionDetail}>
        <div className={classes.sectionLeft}>
          <Paper className={classes.info}>
            <div>
              {' '}
              <img src="https://via.placeholder.com/150" />
            </div>
            <div className={classes.infoRight}>
              <Typography className={classes.titleSectionSecondary} variant="h2">
                Informations sur le site de compostage
              </Typography>
              <List className={classes.infoList}>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Room className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText className={classes.listItem}>
                    {' '}
                    <Typography className={classes.infoTxt} paragraph>
                      {composter.address}{' '}
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <RadioButtonChecked className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt} paragraph>
                      {' '}
                      Quartier
                    </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Person className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt}> Accepte de nouveau adhérents </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <Lock className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt}> En service </Typography>
                  </ListItemText>
                </ListItem>
                <ListItem className={classes.listItem}>
                  <ListItemIcon>
                    <WatchLater className={classes.infoIcone} />
                  </ListItemIcon>
                  <ListItemText>
                    {' '}
                    <Typography className={classes.infoTxt}> Permanences : mercredi de 18h30 à 19h00 et samedi de 11h30 à 12h00 </Typography>
                  </ListItemText>
                </ListItem>
              </List>
            </div>
          </Paper>

          <Paper elevation={1} className={classes.contactezNous}>
            <Typography className={classes.titleSectionSecondary} variant="h2">
              Contactez-nous pour toutes vos questions
            </Typography>
            <form className={classes.container} noValidate autoComplete="off">
              <FormControl fullWidth className={classes.inputGlobal}>
                <InputLabel className={classes.label}>VOTRE E-MAIL</InputLabel>
                <InputBase fullWidth className={classes.input} defaultValue="Entrez votre adresse e-mail" inputProps={{ 'aria-label': 'naked' }} />
              </FormControl>
              <FormControl fullWidth className={classes.inputGlobal}>
                <InputLabel className={classes.label}>VOTRE MESSAGE</InputLabel>
                <InputBase fullWidth className={classes.input} defaultValue="Entrez votre message" inputProps={{ 'aria-label': 'naked' }} />
              </FormControl>
              <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                Envoyer
              </Button>
            </form>
          </Paper>
        </div>
        {composter.lat && composter.lng && (
          <Paper className={classes.map}>
            <MapField record={composter} />
          </Paper>
        )}
      </div>
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
