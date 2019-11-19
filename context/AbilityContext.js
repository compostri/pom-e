import React, { createContext, useContext, useEffect, useState } from 'react'
import { createContextualCan } from '@casl/react'

import Ability, { Action, Subject } from '~/config/ability'
import { UserContext } from '~/context/UserContext'

const AbilityContext = createContext()

const Referent = 'Referent'
const Opener = 'Opener'

const retrieveAbility = capability => {
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
    if (user) {
      const { capability } =
        user.composters.find(({ slug }) => {
          return composterSlug.endsWith(`/${slug}`)
        }) || {}
      const newAbility = retrieveAbility(capability)
      setCurrentAbility(newAbility)
    }
  }, [user, composterSlug])

  return <AbilityContext.Provider value={currentAbility}>{children}</AbilityContext.Provider>
}

const Can = createContextualCan(AbilityContext.Consumer)

export { Can, AbilityContext, Action, Subject }

export default AbilityProvider
