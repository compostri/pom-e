import React, { useContext, useEffect } from 'react'
import { UserContext } from '~/context/UserContext'

export default WrappedPage => {
  const WithUserPersistence = props => {
    const {
      userContext: { user }
    } = useContext(UserContext)

    useEffect(() => {
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      return () => {
        localStorage.removeItem('user')
      }
    }, [user])

    const persitentUser = user || JSON.parse(localStorage.getItem('user'))

    return <WrappedPage {...props} persitentUser={persitentUser} />
  }

  return WithUserPersistence
}
