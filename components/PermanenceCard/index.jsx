import React, { useContext } from 'react'
import classNames from 'classnames'
import { Card, CardContent, CardHeader, Typography, Avatar } from '@material-ui/core'
import { AddCircleOutline, Timeline } from '@material-ui/icons'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'

import { permanenceType } from '~/types'

import useBaseStyle from './PermanenceCard.theme'
import { useTheme, usePermanenceStatus } from './hooks'
import PermanenceCardPopover from './PermanenceCardPopover'
import { Can, Action, Subject } from '~/context/AbilityContext'

import { UserContext } from '~/context/UserContext'

const dateDuJour = dayjs()

const propTypes = { permanence: permanenceType.isRequired }

const PermanceCard = ({ permanence }) => {
  const { MODIFY } = Action
  const { COMPOSTER_STATISTIQUES } = Subject
  const theme = useTheme(permanence)
  const baseStyle = useBaseStyle()
  const { userContext } = useContext(UserContext)

  const isPermDatePassed = dateDuJour.isAfter(permanence.date)

  const { status } = usePermanenceStatus(permanence, dateDuJour)

  const renderIcon = () => {
    if (!isPermDatePassed) return null
    const { nbUsers, nbBuckets, temperature, openers } = permanence
    const openersIds = openers.map(o => o.id)
    console.log('TCL: renderIcon -> openersIds', openersIds)
    const canEdit = userContext.user && openersIds.includes(userContext.user.userId)
    console.log('TCL: renderIcon -> userContext.user.id', userContext.user.userId)

    return nbUsers > 0 || nbBuckets > 0 || temperature > 0 ? (
      <Timeline fontSize="small" />
    ) : (
      <Can I={MODIFY} this={{ $type: COMPOSTER_STATISTIQUES, self: canEdit }}>
        <AddCircleOutline color="secondary" fontSize="small" />
      </Can>
    )
  }

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
      <h2 className={classNames(baseStyle.cardSubHeader, theme.cardSubHeader)}>
        {status}
        {renderIcon()}
      </h2>
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
export { PermanenceCardPopover }
