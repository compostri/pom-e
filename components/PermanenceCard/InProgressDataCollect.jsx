import React from 'react'
import PropTypes from 'prop-types'
import { Formik, Form } from 'formik'
import { Button, TextField, InputAdornment } from '@material-ui/core'
import classNames from 'classnames'
import { permanenceType } from '~/types'
import withFormikField from '~/utils/hoc/withFormikField'
import api from '~/utils/api'
import { usePermanenceToComeWithOpenersStyle } from './hooks'

const InputLabelProps = {
  shrink: true
}
const sumOrDefaultIfEmpty = (value, defaultToSum) => (value === '' ? defaultToSum : value + defaultToSum)

const FormikTextField = withFormikField(TextField)

const InProgressDataCollect = ({ permanence, savePermanence }) => {
  const css = usePermanenceToComeWithOpenersStyle()
  const initialValues = {
    nbUsers: 1,
    nbBuckets: 1,
    weight: ''
  }
  const handleSubmit = async ({ nbUsers, nbBuckets, weight }, actions) => {
    let upToDatePermanence = permanence
    if (permanence.id) {
      upToDatePermanence = await api.getPermanence(permanence.id)
    }

    const payload = {
      id: permanence.id,
      nbUsers: sumOrDefaultIfEmpty(nbUsers, upToDatePermanence.nbUsers),
      nbBuckets: sumOrDefaultIfEmpty(nbBuckets, upToDatePermanence.nbBuckets),
      weight: sumOrDefaultIfEmpty(weight, upToDatePermanence.weight)
    }

    await savePermanence(payload)

    actions.resetForm()
  }
  return (
    <Formik name="add_entry" initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting, dirty }) => {
        return (
          <Form>
            <h3 className={classNames(css.contentTitle, css.contentTitleSpace)}>Ajouter un dépot</h3>
            <FormikTextField id="nbUsers" label="Nombre d'utilisateurs" type="number" className={css.field} InputLabelProps={InputLabelProps} name="nbUsers" />
            <FormikTextField InputLabelProps={InputLabelProps} className={css.field} name="nbBuckets" label="Nombre de seaux" type="number" />

            <FormikTextField
              InputLabelProps={InputLabelProps}
              className={css.field}
              name="weight"
              label="Poids de biodéchets détournés"
              type="number"
              InputProps={{
                step: '0.01',
                endAdornment: <InputAdornment position="end">Kg</InputAdornment>
              }}
            />

            <div>
              <Button
                type="submit"
                className={classNames(css.openerListBtn, css.openerListBtnSubmit)}
                variant="contained"
                classes={{ label: css.openerListBtnLabel }}
                disabled={isSubmitting || !dirty}
              >
                Ajouter
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}

InProgressDataCollect.propTypes = {
  permanence: permanenceType.isRequired,
  savePermanence: PropTypes.func.isRequired
}

export default InProgressDataCollect
