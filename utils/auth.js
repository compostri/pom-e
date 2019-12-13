import jwtDecode from 'jwt-decode'
import cookie from 'js-cookie'

export const getUserInfosFromToken = tk => {
  const token = tk || cookie.get('token')
  if (token) {
    const { iat, exp, ...rest } = jwtDecode(token)
    return rest
  }
  return null
}

export const isValid = tk => {
  const token = tk || cookie.get('token')
  if (token) {
    const { exp } = jwtDecode(token)
    return exp > Math.floor(Date.now() / 1000)
  }
  return false
}
