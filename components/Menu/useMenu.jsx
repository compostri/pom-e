import { useContext } from 'react'
import { useRouter } from 'next/router'

import { ComposterContext } from '~/context/ComposterContext'
import { Action, Subject, AbilityContext } from '~/context/AbilityContext'

const useMenu = () => {
  const { READ } = Action
  const { COMPOSTER_PERMANENCES, COMPOSTER_LISTES_OUVREURS, COMPOSTER_NEWLETTERS } = Subject
  const router = useRouter()
  const {
    composterContext: { composter }
  } = useContext(ComposterContext)
  const abilityContext = useContext(AbilityContext)
  const { slug, permanencesRule } = composter

  return [
    {
      label: 'Informations',
      href: '/composter/[slug]',
      as: `/composter/${slug}`,
      isActive: ['/composter/[slug]', '/composter/[slug]/modifications'].includes(router.pathname)
    },
    abilityContext.can(READ, COMPOSTER_PERMANENCES, permanencesRule) && {
      label: 'Permanences',
      href: '/composter/[slug]/permanences',
      as: `/composter/${slug}/permanences`,
      isActive: router.pathname === '/composter/[slug]/permanences'
    },
    {
      label: 'Statistiques',
      href: '/composter/[slug]/statistiques',
      as: `/composter/${slug}/statistiques`,
      isActive: router.pathname === '/composter/[slug]/statistiques'
    },
    abilityContext.can(READ, COMPOSTER_LISTES_OUVREURS, permanencesRule) && {
      label: "Listes d'ouvreurs",
      href: '/composter/[slug]/ouvreurs',
      as: `/composter/${slug}/ouvreurs`,
      isActive: router.pathname === '/composter/[slug]/ouvreurs'
    },
    abilityContext.can(READ, COMPOSTER_NEWLETTERS, permanencesRule) && {
      label: 'Newsletter',
      href: '/composter/[slug]/newsletter',
      as: `/composter/${slug}/newsletter`,
      isActive: router.pathname === '/composter/[slug]/newsletter'
    }
  ].filter(Boolean)
}

export default useMenu
