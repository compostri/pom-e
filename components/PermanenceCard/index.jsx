import React from 'react'
import classNames from 'classnames'
import { Card, CardContent, CardHeader, Typography, Avatar } from '@material-ui/core'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { permanenceType } from '~/types'

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

PermanceCard.propTypes = propTypes

export default PermanceCard
