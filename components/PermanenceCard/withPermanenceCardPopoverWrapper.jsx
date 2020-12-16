import React, { useContext } from 'react'
import dayjs from 'dayjs'
import PropTypes from 'prop-types'
import { Modal, Card, CardHeader, IconButton, CardContent } from '@material-ui/core'
import classNames from 'classnames'
import { Close as CloseIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'

import { useTheme, usePermanenceStatus } from './hooks'
import useBaseStyle from './PermanenceCard.theme'
import { ComposterContext } from '~/context/ComposterContext'
import { permanenceType } from '~/types'

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

const today = dayjs()

const propTypes = {
  permanence: permanenceType.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
}

const withPermanencePopoverWrapper = WrappedComponent => {
  function WithPermanencePopoverWrapper({ onClose, permanence, onSubmit }) {
    const {
      composterContext: { composter }
    } = useContext(ComposterContext)

    const { status } = usePermanenceStatus(permanence, today)

    const theme = useTheme(permanence)
    const baseStyle = useBaseStyle()
    const classes = useStyles()

    const cardTitle = (
      <>
        <h3 className={classNames(baseStyle.popoverTitle, theme.popoverTitle)}>{permanence.eventTitle}</h3>
        <h2 className={classNames(baseStyle.popoverSubHeader, theme.popoverSubHeader)}>{status}</h2>
      </>
    )

    return (
      <Modal className={classes.modal} open={!!permanence} onClose={onClose}>
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
            <WrappedComponent permanence={permanence} composterId={composter.rid} onSubmit={onSubmit} onCancel={onClose} />
          </CardContent>
        </Card>
      </Modal>
    )
  }
  WithPermanencePopoverWrapper.propTypes = propTypes
  return WithPermanencePopoverWrapper
}

export default withPermanencePopoverWrapper
