import React, { useContext } from 'react'
import dayjs from 'dayjs'
import { Popover, Card, CardHeader, IconButton, CardContent } from '@material-ui/core'
import classNames from 'classnames'
import { Close as CloseIcon } from '@material-ui/icons'

import { useTheme, usePermanenceStatus } from './hooks'
import useBaseStyle from '../PermanenceCard.theme'
import { ComposterContext } from '~/context/ComposterContext'

const today = dayjs()

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
            x
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

  return WithPermanencePopoverWrapper
}

export default withPermanencePopoverWrapper
