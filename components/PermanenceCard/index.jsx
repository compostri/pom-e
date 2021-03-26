import React, { useContext } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { Card, CardContent, CardHeader, Typography, Avatar } from '@material-ui/core'
import { AddCircleOutline, Timeline } from '@material-ui/icons'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
import 'dayjs/locale/fr'

import { permanenceType } from '~/types'

import useBaseStyle from './PermanenceCard.theme'
import { useTheme, usePermanenceStatus } from './hooks'
import PermanenceCardPopover from './PermanenceCardPopover'
import { Can, Action, Subject } from '~/context/AbilityContext'

import { UserContext } from '~/context/UserContext'

const dateDuJour = dayjs()

const propTypes = { permanence: permanenceType.isRequired, highlighted: PropTypes.bool.isRequired }

const PermanceCard = ({ permanence, highlighted }) => {
  const { MODIFY } = Action
  const { COMPOSTER_STATISTIQUES } = Subject
  const theme = useTheme(permanence)
  const baseStyle = useBaseStyle()
  const { userContext } = useContext(UserContext)

  const isPermDatePassed = dateDuJour.isAfter(permanence.date)

  const { status } = usePermanenceStatus(permanence, dateDuJour)

  const renderIcon = () => {
    if (!isPermDatePassed) return null
    const { nbUsers, nbBuckets, temperature, openers, weight } = permanence
    const openersIds = openers.map(o => o.id)
    const canEdit = userContext.user && openersIds.includes(userContext.user.userId)

    return nbUsers > 0 || nbBuckets > 0 || temperature > 0 || weight > 0 ? (
      <Timeline fontSize="small" />
    ) : (
      <Can I={MODIFY} this={{ $type: COMPOSTER_STATISTIQUES, self: canEdit }}>
        <AddCircleOutline color="secondary" fontSize="small" />
      </Can>
    )
  }

  const mayRenderCardFooter = (isCanceled, openers, openersString) => {
    if (isCanceled) return null
    return (
      <div>
        {openers.length > 0 || openersString ? (
          <>
            {openers.map(opener => {
              const userLetter = opener.username.charAt(0).toUpperCase()
              return (
                <div className={baseStyle.cardAvatarList}>
                  <Avatar key={opener.username} className={classNames(baseStyle.cardAvatar, theme.cardAvatar)}>
                    {userLetter}
                  </Avatar>
                  <Typography className={classNames(baseStyle.cardAvatarName, theme.cardAvatarName)}>{opener.username}</Typography>
                </div>
              )
            })}
            {openersString && <Typography className={classNames(baseStyle.cardAvatarName, theme.cardAvatarName)}>{openersString}</Typography>}
          </>
        ) : (
          <>
            <Avatar className={classNames(baseStyle.cardAvatar, theme.cardAvatar)}>?</Avatar>
            <Typography className={baseStyle.noOpenerMsg}>Attention ! Pas d'ouvreur</Typography>
          </>
        )}
      </div>
    )
  }

  const renderCardTitle = isCanceled => {
    if (isCanceled) {
      return <h3 className={classNames(baseStyle.cardTitle, theme.cardTitle)}>Permanence annulée</h3>
    }

    return (
      <>
        <h3 className={classNames(baseStyle.cardTitle, theme.cardTitle)}>{permanence.eventTitle}</h3>
        <h2 className={classNames(baseStyle.cardSubHeader, theme.cardSubHeader)}>
          {status}
          {renderIcon()}
        </h2>
      </>
    )
  }

  const mayRenderHour = isCanceled => {
    if (isCanceled) {
      return null
    }

    // La date n'est pas sauvegarder en UTC mais par defaut il pense oui
    // Forcer le formtage UTC nous renvoie donc la vrai date
    // Cela evite les variations de changement d'horaire
    return dayjs.utc(permanence.date).format('HH:mm')
  }

  return (
    <Card className={classNames(baseStyle.card, theme.card, { [theme.cardHightlighted]: highlighted })}>
      <CardHeader
        className={classNames(baseStyle.cardHeader, theme.cardHeader)}
        title={renderCardTitle(permanence.canceled)}
        subheader={mayRenderHour(permanence.canceled)}
        classes={{
          subheader: classNames(baseStyle.cardSubHeader, theme.cardSubHeader)
        }}
      />
      <CardContent className={classNames(baseStyle.cardContent, theme.cardContent)} classes={{ root: baseStyle.cardContentRoot }}>
        {!isPermDatePassed && mayRenderCardFooter(permanence.canceled, permanence.openers, permanence.openersString)}
      </CardContent>
    </Card>
  )
}

PermanceCard.propTypes = propTypes

export default PermanceCard
export { PermanenceCardPopover }
