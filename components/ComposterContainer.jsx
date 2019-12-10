import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Container, Button, Box } from '@material-ui/core'
import Link from 'next/link'
import classnames from 'classnames'
import { useRouter } from 'next/router'
import Header from '~/components/Header'
import ComposterProvider from '~/context/ComposterContext'
import AbilityProvider, { Can, Action, Subject } from '~/context/AbilityContext'
import palette from '~/variables'

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2, 5, 2, 10)
  },
  containerCenter: {
    padding: 0,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  button: {
    color: palette.greyDark,
    fontSize: '16px',
    fontWeight: '400',
    borderBottomStyle: 'solid',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginRight: theme.spacing(4),
    borderRadius: 0,
    '&:hover, &:focus': {
      borderBottomColor: palette.greenPrimary,
      backgroundColor: 'white'
    }
  },
  activeButton: {
    borderBottomColor: palette.greenPrimary,
    fontWeight: 700,
    backgroundColor: 'white'
  }
}))

const ComposterContainer = ({ composter, maxWidth = 'lg', children }) => {
  const classes = useStyles()
  const { READ } = Action
  const router = useRouter()
  const { COMPOSTER_PERMANENCES, COMPOSTER_LISTES_OUVREURS, COMPOSTER_NEWLETTERS } = Subject
  const { name, slug, permanencesRule } = composter
  return (
    <ComposterProvider composter={composter}>
      <div className={classnames({ [classes.wrapper]: maxWidth })}>
        <AbilityProvider composterSlug={slug}>
          <Header title={name}>
            <div className={classes.toolbarLink}>
              <Link href="/composter/[slug]" as={`/composter/${slug}`} passHref>
                <Button
                  disableRipple
                  className={classnames(classes.button, {
                    [classes.activeButton]: ['/composter/[slug]', '/composter/[slug]/modifications'].indexOf(router.pathname) >= 0
                  })}
                >
                  Informations
                </Button>
              </Link>
              <Can I={READ} this={{ $type: COMPOSTER_PERMANENCES, permanencesRule }}>
                <Link href="/composter/[slug]/permanences" as={`/composter/${slug}/permanences`} passHref>
                  <Button disableRipple className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/permanences' })}>
                    Permanences
                  </Button>
                </Link>
              </Can>
              <Link href="/composter/[slug]/statistiques" as={`/composter/${slug}/statistiques`} passHref>
                <Button disableRipple className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/statistiques' })}>
                  Statistiques
                </Button>
              </Link>
              <Can I={READ} this={COMPOSTER_LISTES_OUVREURS}>
                <Link href="/composter/[slug]/ouvreurs" as={`/composter/${slug}/ouvreurs`} passHref>
                  <Button disableRipple className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/ouvreurs' })}>
                    Listes d'ouvreurs
                  </Button>
                </Link>
              </Can>
              <Can I={READ} this={COMPOSTER_NEWLETTERS}>
                <Link href="/composter/[slug]/newsletter" as={`/composter/${slug}/newsletter`} passHref>
                  <Button disableRipple className={classnames(classes.button, { [classes.activeButton]: router.pathname === '/composter/[slug]/newsletter' })}>
                    Newsletter
                  </Button>
                </Link>
              </Can>
            </div>
          </Header>
          <Box my={4}>
            <Container>{children}</Container>
          </Box>
        </AbilityProvider>
      </div>
    </ComposterProvider>
  )
}

export default ComposterContainer
