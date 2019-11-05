import jwt_decode from 'jwt-decode'
import cookie from 'js-cookie'

export const getUserInfosFromToken = tk => {
  const token = tk || cookie.get('token')
  if (token) {
    const { iat, exp, ...rest } = jwt_decode(token)
    return rest
  }
  return null
}

export const isValid = tk => {
  const token = tk || cookie.get('token')
  if (token) {
    const { exp } = jwt_decode(token)
    return exp > Math.floor(Date.now() / 1000)
  }
  return false
}
