import dayjs from 'dayjs'
import { useBlueTheme, useRedTheme, useGreenTheme, useGreyTheme, useOrangeTheme } from './PermanenceCard.theme'

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
const useTheme = ({ canceled, date, openers, eventTitle, openersString }) => {
  const greenTheme = useGreenTheme()
  const greyTheme = useGreyTheme()
  const redTheme = useRedTheme()
  const blueTheme = useBlueTheme()
  const orangeTheme = useOrangeTheme()

  const isPermDatePassed = today.isAfter(date)
  const hasAnyOpeners = openers.length > 0 || openersString
  const hasTitle = eventTitle

  if (isPermDatePassed) {
    return greyTheme
  }
  if (canceled) {
    return redTheme
  }

  if (hasAnyOpeners) {
    if (hasTitle) {
      return blueTheme
    }
    return greenTheme
  }
  return orangeTheme
}
export { usePermanenceStatus, useTheme }
