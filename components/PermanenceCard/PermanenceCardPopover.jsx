/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { makeStyles } from '@material-ui/styles'
import {
  Avatar,
  IconButton,
  Button,
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  TextField,
  FormControlLabel,
  Switch,
  InputAdornment
} from '@material-ui/core'
import { Delete as DeleteIcon } from '@material-ui/icons'
import { Formik, Form } from 'formik'
import dayjs from 'dayjs'

import { permanenceType } from '~/types'
import palette from '~/variables'
import { Can, Action, Subject, AbilityContext } from '~/context/AbilityContext'
import { UserContext } from '~/context/UserContext'

import useBaseStyle from './PermanenceCard.theme'
import withPermanancePopoverWrapper from './withPermanenceCardPopoverWrapper'
import withFormikField from '~/utils/hoc/withFormikField'
import { useTheme } from './hooks'

const today = dayjs()

const usePermanenceToComeWithOpenersStyle = makeStyles(({ typography, palette }) => ({
  contentTitle: {
    color: palette.greyLight,
    letterSpacing: 0.5,
    fontWeight: 'bold',
    fontSize: typography.pxToRem(8),
    textTransform: 'uppercase',
    margin: 0
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
    marginBottom: 0
  },
  eventMessageText: {
    margin: 0
  }
}))

const getId = opener => opener['@id']

const FormikTextField = withFormikField(TextField)
const FormikSwitch = withFormikField(Switch)
const FormikSelect = withFormikField(Select)

const PermanenceCardPopover = ({ permanence, onSubmit, onCancel }) => {
  const { MODIFY, DELETE } = Action
  const { COMPOSTER_LISTES_OUVREURS, COMPOSTER_OUVREUR, COMPOSTER_PERMANENCE_MESSAGE } = Subject
  const isPermanencePassed = today.isAfter(permanence.date)
  const isPermanenceToCome = !isPermanencePassed

  const initialValues = useMemo(() => {
    const emptyIfNull = value => (value === null ? '' : value)
    const { openers, eventTitle, eventMessage, nbUsers, nbBuckets, weight, temperature, canceled } = permanence
    return {
      openers,
      eventTitle,
      eventMessage,
      canceled,
      nbUsers: emptyIfNull(nbUsers),
      nbBuckets: emptyIfNull(nbBuckets),
      weight: emptyIfNull(weight),
      temperature: emptyIfNull(temperature),
      isPermanenceAnEvent: !!eventTitle
    }
  }, [permanence])

  const {
    userContext: { user }
  } = useContext(UserContext)
  const abilityContext = useContext(AbilityContext)

  const baseStyle = useBaseStyle()
  const theme = useTheme(permanence)
  const css = usePermanenceToComeWithOpenersStyle()

  const handleSubmit = useCallback(
    async ({ openers, eventTitle, eventMessage, nbUsers, nbBuckets, weight, temperature, isPermanenceAnEvent, canceled }, actions) => {
      const mayBeEmptyValue = value => (isPermanenceAnEvent ? value : '')
      const nullIfEmpty = value => (value === '' ? null : value)

      // Faire attention de ne pas renvoyer tous les champs pour les ouvreurs sinon ca fini en erreur 403
      let response = {
        nbUsers: nullIfEmpty(nbUsers),
        nbBuckets: nullIfEmpty(nbBuckets),
        weight: nullIfEmpty(weight),
        temperature: nullIfEmpty(temperature),
        openers: openers.map(getId)
      }
      if (abilityContext.can(Action.MODIFY, Subject.COMPOSTER_LISTES_OUVREURS)) {
        response = {
          ...response,
          ...{
            eventTitle: mayBeEmptyValue(eventTitle),
            eventMessage: mayBeEmptyValue(eventMessage),
            canceled
          }
        }
      }
      await onSubmit(response)

      actions.setSubmitting(false)
    },
    [onSubmit]
  )

  const mayRenderCurrentOpeners = formikProps => {
    const {
      values: { openers },
      setFieldValue
    } = formikProps

    const handleOpenerRemoval = id => () => {
      setFieldValue(
        'openers',
        openers.filter(opener => getId(opener) !== id)
      )
    }

    const renderOpener = (opener, i) => {
      const { username } = opener
      const openerId = getId(opener)
      return (
        <li className={css.openerListItem} key={`edit-opener-${username}-${i}`}>
          <div className={css.openerListItemLeftContent}>
            <Avatar aria-label={username} className={classNames(baseStyle.cardAvatar, theme.cardAvatar, css.avatar)}>
              {username[0]}
            </Avatar>
            {username}
          </div>
          <Can I={MODIFY} this={{ $type: COMPOSTER_LISTES_OUVREURS }}>
            <IconButton aria-label="remove" onClick={handleOpenerRemoval(openerId)} className={css.openerListItemDeleteIcon}>
              <DeleteIcon />
            </IconButton>
          </Can>
          <Can
            I={DELETE}
            this={{
              $type: COMPOSTER_OUVREUR,
              self: user && getId(opener) === `/users/${user.userId}`
            }}
          >
            <IconButton aria-label="remove" onClick={handleOpenerRemoval(openerId)} className={css.openerListItemDeleteIcon}>
              <DeleteIcon />
            </IconButton>
          </Can>
        </li>
      )
    }

    return (
      <>
        <h3 className={css.contentTitle}>Liste des ouvreurs</h3>
        <ul className={css.openerList}>
          {openers.length > 0 ? (
            openers.map(renderOpener)
          ) : (
            <li className={classNames(css.openerListItem, css.noOpenerListItem)}>
              <Avatar className={classNames(classNames(baseStyle.cardAvatar, css.avatar, css.avatarQuestionMark))}>?</Avatar>
              Attention ! Pas d'ouvreur
            </li>
          )}
        </ul>
      </>
    )
  }

  const renderSubmitCancelButtons = (dirty, handleCancel, isSubmitting) =>
    dirty && (
      <>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancel}
          className={classNames(css.openerListBtn, css.openerListBtnCancel)}
          classes={{ label: css.openerListBtnLabel }}
          disabled={isSubmitting}
        >
          Annuler
        </Button>
        <Button
          type="submit"
          className={classNames(css.openerListBtn, css.openerListBtnSubmit)}
          variant="contained"
          classes={{ label: css.openerListBtnLabel }}
          disabled={isSubmitting}
        >
          Enregister
        </Button>
      </>
    )

  const mayRenderOpenerInnerForm = formikProps => {
    if (abilityContext.cannot(Action.CREATE, Subject.COMPOSTER_OUVREUR)) {
      return null
    }
    const {
      values: { openers },
      initialValues: { canceled },
      setFieldValue
    } = formikProps

    const handleOpenerAdding = newOpener => {
      setFieldValue('openers', [...openers, newOpener])
    }

    const isUserAlreadyAddedHimSelf = openers.map(getId).includes(`/users/${user.userId}`)

    const handleAddingCurrentOpener = () => {
      handleOpenerAdding({
        ...user,
        '@id': `/users/${user.userId}`
      })
    }

    if (canceled) {
      return ''
    }

    if (isUserAlreadyAddedHimSelf) {
      return ''
    }
    return (
      <Button
        className={classNames(css.openerListBtn, css.openerListBtnSubmit)}
        variant="contained"
        classes={{ label: css.openerListBtnLabel }}
        onClick={handleAddingCurrentOpener}
      >
        S'ajouter
      </Button>
    )
  }

  const mayRenderEventMessage = useCallback((title, text) => {
    return (
      <>
        {title && <TextField className={css.eventMessageTitle} value={title} label="L’évenement" disabled />}
        {text && <TextField multiple className={css.eventMessageText} value={text} disabled />}
      </>
    )
  }, [])

  const mayRenderInnerFormStats = (formikProps, handleCancel) => {
    const { dirty } = formikProps
    const hasUserBeenOpener = user && permanence.openers.map(getId).includes(`/users/${user.userId}`)

    const isEditable = abilityContext.can(Action.MODIFY, {
      $type: Subject.COMPOSTER_STATISTIQUES,
      self: hasUserBeenOpener
    })

    const disabled = isEditable === false

    const InputLabelProps = {
      shrink: true
    }

    return (
      <Can
        I={MODIFY}
        this={{
          $type: Subject.COMPOSTER_STATISTIQUES,
          self: hasUserBeenOpener
        }}
      >
        <FormikTextField
          InputLabelProps={InputLabelProps}
          className={css.field}
          name="nbUsers"
          label="Nombre d'utilisateurs"
          type="number"
          disabled={disabled}
        />
        <FormikTextField
          InputLabelProps={{
            shrink: true
          }}
          className={css.field}
          name="nbBuckets"
          label="Nombre de sceaux"
          type="number"
          disabled={disabled}
        />
        <FormikTextField
          InputLabelProps={{
            shrink: true
          }}
          className={css.field}
          name="weight"
          label="Poids total de biodéchets détourné"
          type="number"
          inputProps={{ step: 0.1 }}
          disabled={disabled}
        />
        <FormikTextField
          className={css.field}
          name="temperature"
          label="Température du composte"
          type="number"
          disabled={disabled}
          InputLabelProps={InputLabelProps}
          InputProps={{
            endAdornment: <InputAdornment position="end">°C</InputAdornment>
          }}
        />
      </Can>
    )
  }

  const mayRenderRefentInnerForm = formikProps => {
    const {
      values: { openers, isPermanenceAnEvent, canceled }
    } = formikProps

    const mayRenderOpenersSelect = (openersAvailable, openerList) => {
      const hasTobeRendered = openersAvailable.length && openersAvailable > openerList
      if (!hasTobeRendered) {
        return null
      }

      const renderOpenersToAdd = (allOpenersAvailable, openerAdded) => {
        const openerAddedIds = openerAdded.map(getId)
        return allOpenersAvailable.map(openerToAdd => {
          const openerToAddId = getId(openerToAdd)
          return (
            <MenuItem key={openerToAddId} value={openerToAdd}>
              <Checkbox checked={openerAddedIds.includes(openerToAddId)} />
              <ListItemText primary={openerToAdd.username} />
            </MenuItem>
          )
        })
      }

      const renderValue = selected => {
        if (selected.length === 0) {
          return <em>Ajouter des ouvreurs</em>
        }

        return 'Ouvreurs'
      }

      return (
        <FormControl className={css.selectFormControl}>
          <FormikSelect multiple className={css.select} classes={{ root: css.selectRoot }} name="openers" displayEmpty renderValue={renderValue}>
            {renderOpenersToAdd(openersAvailable, openers)}
          </FormikSelect>
        </FormControl>
      )
    }

    const mayRenderNoOpenersWarning = openerList =>
      !openerList.length && (
        <p className={css.noOpenerMsg}>S’il y a aucun ouvreur d’inscrit, la permanence ne pourra pas être assurée. Inscrivez-vous vite ! </p>
      )

    const renderSwitch = (label, SwitchComponent) => {
      return <FormControlLabel className={css.switchRoot} classes={{ label: css.switchLabel }} control={SwitchComponent} label={label} />
    }

    const renderPermanenceEventStatusSwitch = isOn => {
      return renderSwitch('Cette permanence est un événement', <FormikSwitch name="isPermanenceAnEvent" checked={isOn} />)
    }

    const renderCancelingStatusSwitch = isOn => renderSwitch('Annuler cette permanence', <FormikSwitch name="canceled" checked={isOn} />)

    const mayRenderEventFields = hasTobeRendered =>
      hasTobeRendered && (
        <>
          <FormikTextField
            InputLabelProps={{
              shrink: true
            }}
            name="eventTitle"
            label="Titre de l'évènement"
          />
          <FormikTextField
            InputLabelProps={{
              shrink: true
            }}
            multiline
            rows="4"
            name="eventMessage"
            label="Message de l'évènement"
            placeholder="Écrivez ici le message"
          />
        </>
      )

    return (
      <Can I={MODIFY} this={COMPOSTER_LISTES_OUVREURS}>
        {[
          mayRenderOpenersSelect(permanence.$openersAvailable, openers),
          mayRenderNoOpenersWarning(openers),
          renderCancelingStatusSwitch(canceled),
          renderPermanenceEventStatusSwitch(isPermanenceAnEvent),
          mayRenderEventFields(isPermanenceAnEvent)
        ]}
      </Can>
    )
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {formikProps => {
        return (
          <Form>
            {mayRenderCurrentOpeners(formikProps)}
            {mayRenderRefentInnerForm(formikProps, onCancel)}
            {mayRenderOpenerInnerForm(formikProps)}
            <Can not I={MODIFY} this={COMPOSTER_PERMANENCE_MESSAGE}>
              {mayRenderEventMessage(permanence.eventTitle, permanence.eventMessage)}
            </Can>
            {isPermanencePassed && mayRenderInnerFormStats(formikProps, onCancel)}
            {renderSubmitCancelButtons(formikProps.dirty, onCancel, formikProps.isSubmitting)}
          </Form>
        )
      }}
    </Formik>
  )
}

PermanenceCardPopover.propTypes = {
  permanence: permanenceType.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
}

const PopoverPermanenceToCome = withPermanancePopoverWrapper(PermanenceCardPopover)

export default PopoverPermanenceToCome
