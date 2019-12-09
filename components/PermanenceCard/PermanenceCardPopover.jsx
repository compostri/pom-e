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
    marginRight: typography.pxToRem(5)
  },
  avatarQuestionMark: {
    backgroundColor: palette.orangePrimary
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

const PermanenceCardPopover = ({ permanence, onSubmit }) => {
  const { MODIFY, DELETE } = Action
  const { COMPOSTER_LISTES_OUVREURS, COMPOSTER_OUVREUR, COMPOSTER_PERMANENCE_MESSAGE } = Subject
  const isPermanencePassed = today.isAfter(permanence.date)

  const initialValues = useMemo(() => {
    const emptyIfNull = value => (value === null ? '' : value)
    const { openers, eventTitle, eventMessage, nbUsers, nbBuckets, temperature } = permanence
    return {
      openers,
      eventTitle,
      eventMessage,
      nbUsers: emptyIfNull(nbUsers),
      nbBuckets: emptyIfNull(nbBuckets),
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

  const handleSubmit = useCallback(({ openers, eventTitle, eventMessage, nbUsers, nbBuckets, temperature, isPermanenceAnEvent }, actions) => {
    const mayBeEmptyValue = value => (isPermanenceAnEvent ? value : '')
    const nullIfEmpty = value => (value === '' ? null : value)
    const isPermanenceToCome = !isPermanencePassed

    onSubmit(
      isPermanenceToCome
        ? {
            openers: openers.map(getId),
            eventTitle: mayBeEmptyValue(eventTitle),
            eventMessage: mayBeEmptyValue(eventMessage)
          }
        : { nbUsers: nullIfEmpty(nbUsers), nbBuckets: nullIfEmpty(nbBuckets), temperature: nullIfEmpty(temperature) }
    )
    actions.setSubmitting(false)
  }, [])

  const mayRenderNoOpenersWarning = useCallback(
    openerList =>
      !openerList.length && (
        <p className={css.noOpenerMsg}>S’il y a aucun ouvreur d’inscrit, la permanence ne pourra pas être assurée. Inscrivez-vous vite ! </p>
      ),
    [isPermanencePassed]
  )

  const mayRenderCurrentOpeners = useCallback(
    (openerList, onRemoval) => {
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
            <Can I={MODIFY} this={{ $type: COMPOSTER_LISTES_OUVREURS, isPermanencePassed }}>
              <IconButton aria-label="remove" onClick={onRemoval(openerId)} className={css.openerListItemDeleteIcon}>
                <DeleteIcon />
              </IconButton>
            </Can>
            <Can I={DELETE} this={{ $type: COMPOSTER_OUVREUR, self: user && getId(opener) === `/users/${user.userId}`, isPermanencePassed }}>
              <IconButton aria-label="remove" onClick={onRemoval(openerId)} className={css.openerListItemDeleteIcon}>
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
            {openerList.length > 0 ? (
              openerList.map(renderOpener)
            ) : (
              <li className={classNames(css.openerListItem, css.noOpenerListItem)}>
                <Avatar className={classNames(classNames(baseStyle.cardAvatar, css.avatar, css.avatarQuestionMark))}>?</Avatar>
                Attention ! Pas d'ouvreur
              </li>
            )}
          </ul>
        </>
      )
    },
    [user, permanence.date]
  )

  const mayRenderOpenerCapabilityFooter = useCallback(
    (openers, openersAvailable, handleAddingOpener, handleCancel) => {
      if (abilityContext.cannot(Action.CREATE, Subject.COMPOSTER_OUVREUR)) {
        return null
      }

      if (isPermanencePassed) {
        return null
      }

      const isUserSelfEdited = openersAvailable.length !== openers.length

      const isUserAlreadyAddedHimSelf = openers.map(getId).includes(`/users/${user.userId}`)

      const handleAddingCurrentOpener = () => {
        handleAddingOpener({
          ...user,
          '@id': `/users/${user.userId}`
        })
      }

      if (isUserSelfEdited) {
        return (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              className={classNames(css.openerListBtn, css.openerListBtnCancel)}
              classes={{ label: css.openerListBtnLabel }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className={classNames(css.openerListBtn, css.openerListBtnSubmit)}
              variant="contained"
              classes={{ label: css.openerListBtnLabel }}
            >
              Enregister
            </Button>
          </>
        )
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
    },
    [user, abilityContext, isPermanencePassed]
  )

  const mayRenderOpenersSelect = useCallback((openersAvailable, openers) => {
    const hasTobeRendered = openersAvailable.length && openersAvailable > openers
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
  }, [])

  const mayRenderEventFields = useCallback(
    hasTobeRendered =>
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
      ),
    []
  )

  const mayRenderEventMessage = useCallback((title, text) => {
    return (
      <>
        {title && <TextField className={css.eventMessageTitle} value={title} label="L’évenement" disabled />}
        {text && <TextField multiple className={css.eventMessageText} value={text} disabled />}
      </>
    )
  }, [])

  const mayRenderStats = useMemo(() => {
    if (isPermanencePassed === false) {
      return null
    }

    const isEditable = abilityContext.can(Action.MODIFY, {
      $type: Subject.COMPOSTER_STATISTIQUES,
      self: user && permanence.openers.map(getId).includes(`/users/${user.userId}`)
    })

    const disabled = isEditable === false

    return (
      <>
        <FormikTextField
          InputLabelProps={{
            shrink: true
          }}
          className={css.field}
          name="nbUsers"
          label="Utilisateurs"
          type="number"
          disabled={disabled}
        />
        <FormikTextField
          InputLabelProps={{
            shrink: true
          }}
          className={css.field}
          name="nbBuckets"
          label="Sceaux"
          type="number"
          disabled={disabled}
        />
        <FormikTextField
          className={css.field}
          name="temperature"
          label="Température"
          type="number"
          disabled={disabled}
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{
            endAdornment: <InputAdornment position="end">°C</InputAdornment>
          }}
        />
      </>
    )
  }, [isPermanencePassed, abilityContext, user, permanence])

  const mayRenderSwitch = useCallback(isPermanenceAnEvent => {
    return (
      <FormControlLabel
        className={css.switchRoot}
        classes={{ label: css.switchLabel }}
        control={<FormikSwitch name="isPermanenceAnEvent" checked={isPermanenceAnEvent} />}
        label="Cette permanence est un événement"
      />
    )
  }, [])

  const renderCancelSubmitButton = useCallback(
    (setValues, dirty) => {
      const handleCancel = () => {
        setValues(initialValues)
      }

      return (
        dirty && (
          <>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancel}
              className={classNames(css.openerListBtn, css.openerListBtnCancel)}
              classes={{ label: css.openerListBtnLabel }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className={classNames(css.openerListBtn, css.openerListBtnSubmit)}
              variant="contained"
              classes={{ label: css.openerListBtnLabel }}
            >
              Enregister
            </Button>
          </>
        )
      )
    },
    [initialValues]
  )

  const mayRenderRefentPopoverBody = useCallback(
    ({ openers, isPermanenceAnEvent }) => {
      if (isPermanencePassed) {
        return null
      }
      return [
        mayRenderOpenersSelect(permanence.$openersAvailable, openers),
        mayRenderNoOpenersWarning(openers),
        mayRenderSwitch(isPermanenceAnEvent),
        mayRenderEventFields(isPermanenceAnEvent)
      ]
    },
    [permanence, isPermanencePassed]
  )

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue, setValues, dirty }) => {
        const handleOpenerRemoval = id => () => {
          setFieldValue(
            'openers',
            values.openers.filter(opener => getId(opener) !== id)
          )
        }
        const handleOpenerAdding = newOpener => {
          setFieldValue('openers', [...values.openers, newOpener])
        }
        const handleCancel = () => {
          setFieldValue('openers', initialValues.openers)
        }

        return (
          <Form>
            {mayRenderCurrentOpeners(values.openers, handleOpenerRemoval)}
            {mayRenderStats}
            <Can I={MODIFY} this={COMPOSTER_LISTES_OUVREURS}>
              {mayRenderRefentPopoverBody(values)}
            </Can>
            <Can
              I={MODIFY}
              this={{
                $type: Subject.COMPOSTER_STATISTIQUES,
                self: user && permanence.openers.map(getId).includes(`/users/${user.userId}`)
              }}
            >
              {renderCancelSubmitButton(setValues, dirty)}
            </Can>
            <Can not I={MODIFY} this={COMPOSTER_PERMANENCE_MESSAGE}>
              {mayRenderEventMessage(permanence.eventTitle, permanence.eventMessage)}
            </Can>
            {mayRenderOpenerCapabilityFooter(values.openers, initialValues.openers, handleOpenerAdding, handleCancel)}
          </Form>
        )
      }}
    </Formik>
  )
}

PermanenceCardPopover.propTypes = {
  permanence: permanenceType.isRequired,
  onSubmit: PropTypes.func.isRequired
}

const PopoverPermanenceToCome = withPermanancePopoverWrapper(PermanenceCardPopover)

export default PopoverPermanenceToCome
