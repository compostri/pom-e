import dayjs from 'dayjs'
import { makeStyles } from '@material-ui/styles'
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

const usePermanenceToComeWithOpenersStyle = makeStyles(({ typography, palette }) => ({
  contentTitle: {
    color: palette.greyLight,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    fontSize: typography.pxToRem(8),
    textTransform: 'uppercase',
    margin: 0
  },
  contentTitleSpace: {
    marginBottom: typography.pxToRem(14),
    marginTop: typography.pxToRem(14)
  },
  avatar: {
    marginRight: typography.pxToRem(5)
  },
  avatarQuestionMark: {
    backgroundColor: palette.redPrimary
  },
  openerList: {
    padding: 0,
    margin: 0
  },
  openerListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: typography.pxToRem(7),
    padding: typography.pxToRem(10),
    backgroundColor: palette.greyExtraLight,
    fontSize: typography.pxToRem(11),
    color: palette.greyMedium,
    listStyle: 'none'
  },
  field: {
    marginTop: typography.pxToRem(10),
    marginBottom: 0,
    fontSize: typography.pxToRem(11),
    width: '100%',
    color: palette.greyMedium,
    textAlign: 'center'
  },
  noOpenerListItem: {
    justifyContent: 'flex-start',
    color: 'red'
  },
  openerListItemLeftContent: {
    display: 'flex',
    alignItems: 'center'
  },
  openerListItemDeleteIcon: {
    padding: 0
  },
  openerListBtn: {
    width: '100%',
    marginTop: typography.pxToRem(14)
  },
  openerListBtnSubmit: {
    backgroundColor: palette.greenPrimary,
    color: palette.white
  },
  openerListBtnCancel: {
    backgroundColor: palette.white
  },
  openerListBtnLabel: {
    fontSize: typography.pxToRem(12)
  },
  selectFormControl: {
    width: '100%'
  },
  select: {
    marginTop: typography.pxToRem(4),
    padding: 0
  },
  selectRoot: {
    padding: typography.pxToRem(12)
  },
  switchRoot: {
    marginBottom: typography.pxToRem(14),
    marginTop: typography.pxToRem(14)
  },
  switchLabel: {
    fontSize: typography.pxToRem(11)
  },
  textarea: {
    fontSize: typography.pxToRem(11)
  },
  noOpenerMsg: {
    color: palette.greyDark,
    fontSize: typography.pxToRem(11)
  },
  eventMessageTitle: {
    marginTop: typography.pxToRem(14),
    marginBottom: 0,
    width: '100%'
  },
  eventMessageText: {
    margin: 0,
    width: '100%'
  }
}))

export { usePermanenceStatus, useTheme, usePermanenceToComeWithOpenersStyle }
