import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, CardHeader, Typography, Avatar, IconButton, Button } from '@material-ui/core'
import { StarRate as StarRateIcon, Close as CloseIcon } from '@material-ui/icons'
import Popover from '@material-ui/core/Popover'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { permanenceType } from '~/types'
import palette from '~/variables'

import useBaseStyle, { useBlueTheme, useRedTheme, useGreenTheme, useGreyTheme } from './PermanenceCard.theme'

const dateDuJour = dayjs()

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

  const isPermDatePassed = dateDuJour.isAfter(date)
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

const propTypes = { permanence: permanenceType.isRequired }

const PermanceCard = ({ permanence }) => {
  const theme = useTheme(permanence)
  const baseStyle = useBaseStyle()

  const isPermDatePassed = dateDuJour.isAfter(permanence.date)

  const { status } = usePermanenceStatus(permanence, dateDuJour)

  const renderCardFooter = openers => {
    return (
      <div className={baseStyle.cardAvatarList}>
        {openers.length > 0 ? (
          openers.map(opener => {
            const userLetter = opener.username.charAt(0).toUpperCase()
            return (
              <Avatar key={opener.username} className={classNames(baseStyle.cardAvatar, theme.cardAvatar)}>
                {userLetter}
              </Avatar>
            )
          })
        ) : (
          <>
            <Avatar className={classNames(baseStyle.cardAvatar, theme.cardAvatar)}>?</Avatar>
            <Typography className={baseStyle.noOpenerMsg}>Attention ! Pas d'ouvreur</Typography>
          </>
        )}
      </div>
    )
  }

  const cardTitle = (
    <>
      <h3 className={classNames(baseStyle.cardTitle, theme.cardTitle)}>{permanence.eventTitle}</h3>
      <h2 className={classNames(baseStyle.cardSubHeader, theme.cardSubHeader)}>{status}</h2>
    </>
  )

  return (
    <Card className={baseStyle.card}>
      <CardHeader
        className={classNames(baseStyle.cardHeader, theme.cardHeader)}
        title={cardTitle}
        subheader={dayjs(permanence.date).format('HH:mm')}
        classes={{
          subheader: classNames(baseStyle.cardSubHeader, theme.cardSubHeader)
        }}
      />
      <CardContent className={classNames(baseStyle.cardContent, theme.cardContent)} classes={{ root: baseStyle.cardContentRoot }}>
        {!isPermDatePassed && renderCardFooter(permanence.openers)}
      </CardContent>
    </Card>
  )
}

const PopoverPermanence = ({ anchorEl, onClose, permanence, vertical, horizontal }) => {
  const { status } = usePermanenceStatus(permanence, dateDuJour)

  const { openers } = permanence

  const theme = useTheme(permanence)
  const baseStyle = useBaseStyle()
  const permanenceToComeWithOpenersStyle = usePermanenceToComeWithOpenersStyle()

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

  const renderGreenCardContent = openerList => {
    const { openerListItem, avatar, contentTitle, openerList: openerListStyle, openerListBtnLabel, openerListBtn } = permanenceToComeWithOpenersStyle
    const mayRenderOpeners = openerGroup => {
      const renderOpener = ({ username }, i) => (
        <li className={openerListItem} key={`edit-opener-${username}-${i}`}>
          <Avatar aria-label={username} className={classNames(baseStyle.cardAvatar, avatar)}>
            {username[0]}
          </Avatar>
          {username}
        </li>
      )
      return (
        openerGroup.length > 0 && (
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
        <CardContent className={baseStyle.popoverCardContent}>{renderGreenCardContent(openers)}</CardContent>
      </Card>
    </Popover>
  )
}

PermanceCard.propTypes = propTypes
PopoverPermanence.propTypes = {
  permanence: permanenceType.isRequired,
  onClose: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  anchorEl: PropTypes.object.isRequired,
  vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
  horizontal: PropTypes.oneOf(['left', 'right']).isRequired
}
export { PopoverPermanence }
export default PermanceCard
