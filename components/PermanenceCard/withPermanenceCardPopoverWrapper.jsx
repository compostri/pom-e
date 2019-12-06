import React, { useContext } from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { Popover, Card, CardHeader, IconButton, CardContent } from '@material-ui/core'
import classNames from 'classnames'
import { Close as CloseIcon } from '@material-ui/icons'

import { useTheme, usePermanenceStatus } from './hooks'
import useBaseStyle from './PermanenceCard.theme'
import { ComposterContext } from '~/context/ComposterContext'
import { permanenceType } from '~/types'

const today = dayjs()

const propTypes = {
  anchorEl: PropTypes.elementType.isRequired,
  vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
  horizontal: PropTypes.oneOf(['left', 'right']).isRequired,
  permanence: permanenceType.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

const withPermanencePopoverWrapper = WrappedComponent => {
  function WithPermanencePopoverWrapper({ anchorEl, onClose, permanence, vertical, horizontal, onSubmit }) {
    const {
      composterContext: { composter }
    } = useContext(ComposterContext)

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
            <WrappedComponent permanence={permanence} composterId={composter.rid} onSubmit={onSubmit} />
          </CardContent>
        </Card>
      </Popover>
    )
  }
  WithPermanencePopoverWrapper.propTypes = propTypes
  return WithPermanencePopoverWrapper
}

export default withPermanencePopoverWrapper
