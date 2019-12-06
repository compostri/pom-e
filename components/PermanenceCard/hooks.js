import dayjs from 'dayjs'
import { useBlueTheme, useRedTheme, useGreenTheme, useGreyTheme } from './PermanenceCard.theme'

const today = dayjs()

const usePermanenceStatus = ({ canceled, date }) => {
  const isPermDatePassed = today.isAfter(date)
  const setStatus = status => ({ status })

  if (canceled) {
    return setStatus('Permanence annulée')
  }
  if (isPermDatePassed) {
    return setStatus('Permanence passée')
  }

  return setStatus('Permanence à venir')
}
const useTheme = ({ canceled, date, openers, eventTitle }) => {
  const greenTheme = useGreenTheme()
  const greyTheme = useGreyTheme()
  const redTheme = useRedTheme()
  const blueTheme = useBlueTheme()

  const isPermDatePassed = today.isAfter(date)
  const hasAnyOpeners = openers.length > 0
  const hasTitle = eventTitle

  if (isPermDatePassed || canceled) {
    return greyTheme
  }

  if (hasAnyOpeners) {
    if (hasTitle) {
      return blueTheme
    }
    return greenTheme
  }
  return redTheme
}
export { usePermanenceStatus, useTheme }
