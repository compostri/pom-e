/* eslint-disable react/jsx-props-no-spreading */
import React, { memo } from 'react'
import { useField } from 'formik'
import PropTypes from 'prop-types'

const withFormikField = WrappedComponent => {
  function WithFormikField({ name: propName, ...props }) {
    const [{ onChange, onBlur, name, value }, meta] = useField(propName)
    return (
      <>
        <WrappedComponent value={value} onChange={onChange} onBlur={onBlur} name={name} {...props} />
        {meta.error && meta.touched && <div>{meta.error}</div>}
      </>
    )
  }

  WithFormikField.propTypes = {
    name: PropTypes.string.isRequired
  }

  return memo(WithFormikField)
}

export default withFormikField
