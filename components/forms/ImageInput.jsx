import React, { useState, useMemo } from 'react'
import { Button, Box, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Add, Close } from '@material-ui/icons'

import PropTypes from 'prop-types'
import MNFile from '../MNFile'
import withFormikField from '~/utils/hoc/withFormikField'
import api from '~/utils/api'
import { mediaObjectType } from '~/types'
import { useToasts } from 'react-toast-notifications'
import { TOAST } from '../Snackbar'

const useStyles = makeStyles(theme => ({
  icon: {
    width: 15,
    marginRight: 10
  },
  imgClose: {
    position: 'absolute',
    right: 0,
    top: 0,
    transform: 'translate(50%, -50%)',
    border: `1px solid ${theme.palette.primary.main}`,
    backgroundColor: '#fff',
    '&:hover, &:focus': {
      backgroundColor: '#fff'
    }
  },
  imgContainer: {
    position: 'relative',
    display: 'inline-block',
    marginTop: 18,
    width: 'calc(100% - 18px)'
  },
  img: {
    width: '100%',
    height: 'auto',
    display: 'block'
  }
}))

// eslint-disable-next-line react/jsx-props-no-spreading
const InputFileElement = (...props) => <input {...props} type="file" />
const FormikInputFile = withFormikField(InputFileElement)

const propTypes = {
  label: PropTypes.string.isRequired,
  onLoadEnd: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  id: PropTypes.string,
  value: PropTypes.oneOfType([mediaObjectType, PropTypes.arrayOf(mediaObjectType)]),
  multiple: PropTypes.bool
}

const defaultProps = {
  id: 'image',
  value: null,
  multiple: false
}

const ImageInput = ({ label, onLoadEnd, name: inputName, id: fieldId, value: media, multiple }) => {
  const classes = useStyles()
  const { addToast } = useToasts()
  const [previews, setPreviews] = useState(media ? [media] : [])
  const shouldDispayButton = useMemo(() => !multiple && previews.length === 0, [previews, multiple])

  const handleChange = async files => {
    const Promises = files.map(file => {
      const { name: imageName, url: data } = file
      return api.uploadMedia({ imageName, data })
    })
    const res = await Promise.all(Promises)
    setPreviews(res)
    const valueSent = multiple ? res : res[0]
    onLoadEnd(valueSent)
  }

  const handleRemove = async id => {
    const success = await api.removeMedia(id).catch(() => addToast('Une erreur est survenue au moment de la suppression', TOAST.ERROR))
    if (success) {
      setPreviews(previews.filter(prev => prev.id !== id))
      onLoadEnd(null)
    }
  }

  return (
    <>
      {previews.map(({ imageName, contentUrl, id }) => (
        <Box boxShadow={1} key={imageName} className={classes.imgContainer}>
          <img src={contentUrl} alt={imageName} className={classes.img} />
          <IconButton size="small" className={classes.imgClose} onClick={() => handleRemove(id)}>
            <Close />
          </IconButton>
        </Box>
      ))}
      {shouldDispayButton && (
        <MNFile
          label={
            <Button variant="outlined" color="primary" size="small" component="span">
              <Add className={classes.icon} />
              {label}
            </Button>
          }
          input={<FormikInputFile accept="image/*" name={inputName} id={fieldId} onChange={handleChange} />}
        />
      )}
    </>
  )
}

ImageInput.propTypes = propTypes
ImageInput.defaultProps = defaultProps
export default ImageInput
