import React, { createContext, useContext, useEffect, useState } from 'react'
import { createContextualCan } from '@casl/react'
import nextCookie from 'next-cookies'
import Router from 'next/router'
import PropTypes from 'prop-types'

import { Ability, Action, Subject } from '~/config/ability'
import { UserContext } from '~/context/UserContext'
import { getUserInfosFromToken } from '~/utils/auth'

const AbilityContext = createContext()

const Referent = 'Referent'
const Opener = 'Opener'

function redirect({ Router: router, ctx, location, status = 302 }) {
  if (ctx.res) {
    ctx.res.writeHead(status, {
      Location: location,
      // Add the content-type for SEO considerations
      'Content-Type': 'text/html; charset=utf-8'
    })
    ctx.res.end()
    return
  }

  router.replace(location)
}

const getAbilityBuilder = ({ user, composterSlug }) => {
  const { capability } =
    user.composters.find(({ slug }) => {
      return composterSlug === slug
    }) || {}

  switch (capability) {
    case Opener:
      return Ability.Opener
    case Referent:
      return Ability.Referent
    default:
      return Ability.Default
  }
}

const AbilityProvider = ({ children, composterSlug }) => {
  const {
    userContext: { user }
  } = useContext(UserContext)

  const [currentAbility, setCurrentAbility] = useState(Ability.Default)

  useEffect(() => {
    setCurrentAbility(user ? getAbilityBuilder({ user, composterSlug }) : Ability.Default)
  }, [user, composterSlug])

  return <AbilityContext.Provider value={currentAbility}>{children}</AbilityContext.Provider>
}

const Can = createContextualCan(AbilityContext.Consumer)

const withAccessAbility = (subject, redirectUrl = () => '/') => getInitialPropsFn => async ctx => {
  const { slug: composterSlug } = ctx.query

  const user = getUserInfosFromToken(nextCookie(ctx).token)

  const userAbility = getAbilityBuilder({ user, composterSlug })

  if (typeof subject === 'function') {
    const initialProps = await getInitialPropsFn(ctx)
    if (userAbility.can(Action.READ, subject(initialProps, ctx))) {
      return initialProps
    }
  }

  if (userAbility.can(Action.READ, subject)) {
    return getInitialPropsFn(ctx)
  }

  redirect({ Router, ctx, location: redirectUrl(ctx) })
  return {}
}

export { Can, AbilityContext, Action, Subject, withAccessAbility }

AbilityProvider.propTypes = {
  children: PropTypes.node.isRequired,
  composterSlug: PropTypes.string.isRequired
}
export default AbilityProvider
