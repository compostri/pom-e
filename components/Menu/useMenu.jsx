import { useContext } from 'react'
import { useRouter } from 'next/router'

import { ComposterContext } from '~/context/ComposterContext'
import { Action, Subject, AbilityContext } from '~/context/AbilityContext'
import { UserContext } from '~/context/UserContext'

const useMenu = () => {
  const { READ } = Action
  const { COMPOSTER_PERMANENCES, COMPOSTER_LISTES_OUVREURS, COMPOSTER_NEWLETTERS } = Subject
  const router = useRouter()
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)
  const abilityContext = useContext(AbilityContext)
  const { userContext } = useContext(UserContext)
  const { slug, permanencesRule } = composter

  return [
    {
      label: 'Informations',
      href: '/composteur/[slug]',
      as: `/composteur/${slug}`,
      isActive: ['/composteur/[slug]', '/composteur/[slug]/modifications'].includes(router.pathname)
    },
    permanencesRule &&
      abilityContext.can(READ, COMPOSTER_PERMANENCES, permanencesRule) && {
        label: 'Permanences',
        href: '/composteur/[slug]/permanences',
        as: `/composteur/${slug}/permanences`,
        isActive: router.pathname === '/composteur/[slug]/permanences'
      },
    userContext.isLoggedIn() && {
      label: 'Statistiques',
      href: '/composteur/[slug]/statistiques',
      as: `/composteur/${slug}/statistiques`,
      isActive: router.pathname === '/composteur/[slug]/statistiques'
    },
    abilityContext.can(READ, COMPOSTER_LISTES_OUVREURS, permanencesRule) && {
      label: 'Liste des utilisateurs',
      href: '/composteur/[slug]/utilisateurs',
      as: `/composteur/${slug}/utilisateurs`,
      isActive: router.pathname === '/composteur/[slug]/utilisateurs'
    },
    abilityContext.can(READ, COMPOSTER_NEWLETTERS, permanencesRule) && {
      label: 'Messagerie',
      href: '/composteur/[slug]/newsletter',
      as: `/composteur/${slug}/newsletter`,
      isActive: router.pathname === '/composteur/[slug]/newsletter'
    }
  ].filter(Boolean)
}

export default useMenu
