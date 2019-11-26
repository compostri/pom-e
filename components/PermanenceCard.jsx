import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { Card, CardContent, Typography, Avatar } from '@material-ui/core'

import StarRateIcon from '@material-ui/icons/StarRate'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import palette from '~/variables'

import { permanenceType } from '~/types'
import { getInitial } from '~/utils/utils'

const useStyles = makeStyles(({ typography }) => ({
  card: {
    backgroundColor: palette.greyExtraLight,
    height: typography.pxToRem(85)
  },
  cardRoot: {
    padding: '6px'
  },
  event: {
    display: 'flex',
    flexDirection: 'row'
  },
  eventTitle: {
    flexGrow: 1
  },
  starIcon: {
    width: 20
  },
  permTitle: {
    fontWeight: 'bold'
  },
  permHour: {
    fontSize: 12,
    marginBottom: 40
  },
  avatar: {
    color: 'white',
    fontSize: 15,
    marginRight: '2%',
    width: 22,
    height: 22
  },
  avatarLine: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },
  noOpenerMsg: {
    fontSize: 12,
    color: palette.orangePrimary,
    marginLeft: '2%'
  }
}))

const dateDuJour = dayjs()

const propTypes = { permanence: permanenceType.isRequired }

const PermanceCard = ({ permanence }) => {
  const classes = useStyles()
  const isCanceled = permanence.canceled
  const isPermDatePassed = dateDuJour.isAfter(permanence.date)

  const getPermanenceCardColor = ({ openers, eventTitle }) => {
    const permanenceCardBackground = '#edf3d8'
    const hasAnyOpeners = openers.length > 0
    const hasTitle = eventTitle

    if (isPermDatePassed || isCanceled) {
      return { permanenceCardContentColor: palette.greyMedium, permanenceCardBackground: palette.greyExtraLight }
    }

    if (hasAnyOpeners) {
      if (hasTitle) {
        return { permanenceCardContentColor: palette.blue, permanenceCardBackground: palette.blueExtraLight }
      }
      return { permanenceCardContentColor: palette.greenPrimary, permanenceCardBackground }
    }
    return { permanenceCardContentColor: palette.orangePrimary, permanenceCardBackground: palette.orangeExtraLight }
  }

  const { permanenceCardContentColor, permanenceCardBackground } = getPermanenceCardColor(permanence)
  let permStatus = 'Permanence à venir'
  if (isCanceled) {
    permStatus = 'Permanence annulée'
  } else if (isPermDatePassed) {
    permStatus = 'Permanence passée'
  }

  const renderCardFooter = (openers, backgroundColor) => {
    return (
      <div className={classes.avatarLine}>
        {openers.length > 0 ? (
          openers.map(opener => {
            return (
              <Avatar key={opener.username} style={{ backgroundColor }} className={classes.avatar}>
                {getInitial(opener.username)}
              </Avatar>
            )
          })
        ) : (
          <>
            <Avatar style={{ backgroundColor }} className={classes.avatar}>
              ?
            </Avatar>
            <Typography className={classes.noOpenerMsg}>Attention ! Pas d'ouvreur</Typography>
          </>
        )}
      </div>
    )
  }

  return (
    <Card
      style={{ backgroundColor: permanenceCardBackground }}
      className={classes.card}
      classes={{
        root: classes.cardRoot
      }}
    >
      <CardContent>
        {/* Titre de l'évênement si évênement */}
        {permanence.eventTitle && (
          <div className={classes.event}>
            <Typography className={classes.eventTitle} style={{ color: permanenceCardContentColor }}>
              {permanence.eventTitle}
            </Typography>
            <StarRateIcon style={{ color: permanenceCardContentColor }} className={classes.starIcon} />
          </div>
        )}
        {/* Permanence à venir ou Permanence passée */}

        <Typography style={{ color: permanenceCardContentColor }} className={classes.permTitle}>
          {permStatus}
        </Typography>

        {/* Heure de la Permanence */}
        <Typography style={{ color: permanenceCardContentColor }} className={classes.permHour}>
          {dayjs(permanence.date).format('HH:mm')}
        </Typography>
        {!isPermDatePassed && renderCardFooter(permanence.openers, permanenceCardContentColor)}
      </CardContent>
    </Card>
  )
}

PermanceCard.propTypes = propTypes

export default PermanceCard
