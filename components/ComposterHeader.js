import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Typography, AppBar, Button, Toolbar, IconButton } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import classnames from 'classnames'
import palette from '~/variables'
import { Can, Action, Subject } from '~/context/AbilityContext'
import UserButton from './UserButton'

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
  activeButton: {
    borderBottomColor: palette.greenPrimary,
    backgroundColor: 'white'
  }
}))

const Header = ({ composter: { slug, name, permanencesRule } }) => {
  const classes = useStyles()
  const router = useRouter()

  const { READ } = Action
  const { COMPOSTER_PERMANENCES, COMPOSTER_LISTES_OUVREURS, COMPOSTER_NEWLETTERS } = Subject

  return (
    <AppBar className={classes.appBar} position='static' elevation={1}>
      <Toolbar className={classes.toolbarGlobal} disableGutters>
        <Link href='/' passHref>
          <IconButton className={classes.logo}>
            <img className={classes.logoSvg} src='/static/logo2.svg' />
          </IconButton>
        </Link>
        <div className={classes.toolbarLeft}>
          <div className={classes.toolbarTitle}>
            <Link href='/' passHref>
              <IconButton className={classes.chevronLeft}>
                <ChevronLeft />
              </IconButton>
            </Link>
            <Typography variant='h1' className={classes.title}>
              {name}
            </Typography>
          </div>
          <div className={classes.toolbarLink}>
            <Link href='/composter/[slug]' as={`/composter/${slug}`} passHref>
              <Button className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]' })}>Informations</Button>
            </Link>
            <Can I={READ} this={{ $type: COMPOSTER_PERMANENCES, permanencesRule }}>
              <Link href='/composter/[slug]/permanences' as={`/composter/${slug}/permanences`} passHref>
                <Button className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/permanences' })}>
                  Permanences
                </Button>
              </Link>
            </Can>
            <Link href='/composter/[slug]/statistiques' as={`/composter/${slug}/statistiques`} passHref>
              <Button className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/statistiques' })}>
                Stastiques
              </Button>
            </Link>
            <Can I={READ} this={COMPOSTER_LISTES_OUVREURS}>
              <Link href='/composter/[slug]/ouvreurs' as={`/composter/${slug}/ouvreurs`} passHref>
                <Button className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/ouvreurs' })}>
                  Listes d'ouvreurs
                </Button>
              </Link>
            </Can>
            <Can I={READ} this={COMPOSTER_NEWLETTERS}>
              <Link href='/composter/[slug]/newsletter' as={`/composter/${slug}/newsletter`} passHref>
                <Button className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/newsletter' })}>
                  Newsletter
                </Button>
              </Link>
            </Can>
          </div>
        </div>

        <UserButton />
      </Toolbar>
    </AppBar>
  )
}

export default Header
