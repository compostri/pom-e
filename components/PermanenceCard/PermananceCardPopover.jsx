import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, CardHeader, Avatar, IconButton, Button } from '@material-ui/core'
import { Close as CloseIcon } from '@material-ui/icons'
import Popover from '@material-ui/core/Popover'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { permanenceType } from '~/types'
import palette from '~/variables'

import useBaseStyle, { useBlueTheme, useRedTheme, useGreenTheme, useGreyTheme } from './PermanenceCard.theme'

const today = dayjs()

const usePermanenceStatus = ({ canceled, date: permDate }, date) => {
  const isPermDatePassed = date.isAfter(permDate)
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

const usePermanenceToComeWithOpenersStyle = makeStyles(({ typography }) => ({
  contentTitle: {
    color: palette.greyLight,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    fontSize: typography.pxToRem(8),
    textTransform: 'uppercase',
    margin: 0
  },
  avatar: {
    backgroundColor: palette.greenPrimary,
    marginRight: typography.pxToRem(5)
  },
  openerList: {
    padding: 0,
    margin: 0
  },
  openerListItem: {
    display: 'flex',
    alignItems: 'center',
    marginTop: typography.pxToRem(7),
    padding: typography.pxToRem(10),
    backgroundColor: palette.greyExtraLight,
    fontSize: typography.pxToRem(11),
    color: palette.greyMedium,
    listStyle: 'none'
  },
  openerListBtn: {
    backgroundColor: palette.greenPrimary,
    color: palette.white,
    width: '100%',
    marginTop: typography.pxToRem(14)
  },
  openerListBtnLabel: {
    fontSize: typography.pxToRem(12)
  }
}))

const withPermanancePopoverWrapper = WrappedComponent => {
  function WithPermanancePopoverWrapper({ anchorEl, onClose, permanence, vertical, horizontal }) {
    const { status } = usePermanenceStatus(permanence, today)

    const theme = useTheme(permanence)
    const baseStyle = useBaseStyle()

    const { anchorOrigin, transformOrigin } = {
      anchorOrigin: {
        vertical: vertical === 'top' ? 'bottom' : 'top',
        horizontal: horizontal === 'left' ? 'right' : 'left'
      },
      transformOrigin: {
        vertical,
        horizontal
      }
    }

    const cardTitle = (
      <>
        <h3 className={classNames(baseStyle.popoverTitle, theme.popoverTitle)}>{permanence.eventTitle}</h3>
        <h2 className={classNames(baseStyle.popoverSubHeader, theme.popoverSubHeader)}>{status}</h2>
      </>
    )

    return (
      <Popover open={!!anchorEl} anchorEl={anchorEl} onClose={onClose} anchorOrigin={anchorOrigin} transformOrigin={transformOrigin}>
        <Card className={baseStyle.popoverCard}>
          <CardHeader
            title={cardTitle}
            subheader={dayjs(permanence.date).format('HH:mm')}
            action={
              <IconButton aria-label="close" onClick={onClose}>
                <CloseIcon className={classNames(baseStyle.popoverCloseIcon, theme.popoverCloseIcon)} />
              </IconButton>
            }
            className={classNames(baseStyle.popoverHeader, theme.popoverHeader)}
            classes={{
              subheader: classNames(baseStyle.popoverSubHeader, theme.popoverSubHeader)
            }}
          />
          <CardContent className={baseStyle.popoverCardContent}>
            <WrappedComponent permanence={permanence} />
          </CardContent>
        </Card>
      </Popover>
    )
  }

  WithPermanancePopoverWrapper.propTypes = {
    permanence: permanenceType.isRequired,
    onClose: PropTypes.func.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    anchorEl: PropTypes.object.isRequired,
    vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
    horizontal: PropTypes.oneOf(['left', 'right']).isRequired
  }

  return WithPermanancePopoverWrapper
}

const PopoverPermanenceToComeContent = ({ permanence: { openers } }) => {
  const baseStyle = useBaseStyle()
  const permanenceToComeWithOpenersStyle = usePermanenceToComeWithOpenersStyle()
  const { openerListItem, avatar, contentTitle, openerList: openerListStyle, openerListBtnLabel, openerListBtn } = permanenceToComeWithOpenersStyle
  const mayRenderOpeners = openerList => {
    const renderOpener = ({ username }, i) => (
      <li className={openerListItem} key={`edit-opener-${username}-${i}`}>
        <Avatar aria-label={username} className={classNames(baseStyle.cardAvatar, avatar)}>
          {username[0]}
        </Avatar>
        {username}
      </li>
    )

    return (
      openerList.length > 0 && (
        <>
          <h3 className={contentTitle}>Liste des ouvreurs</h3>
          <ul className={openerListStyle}>{openerList.map(renderOpener)}</ul>
        </>
      )
    )
  }
  return (
    <>
      {mayRenderOpeners(openers)}
      <Button className={openerListBtn} variant="contained" classes={{ label: openerListBtnLabel }}>
        Modifier
      </Button>
    </>
  )
}

PopoverPermanenceToComeContent.propTypes = {
  permanence: permanenceType.isRequired
}

const PopoverPermanenceToCome = withPermanancePopoverWrapper(PopoverPermanenceToComeContent)

export { PopoverPermanenceToCome }
