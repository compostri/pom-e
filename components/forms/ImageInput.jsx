import React from 'react'
import { Button, Box, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Add, Close } from '@material-ui/icons'

import PropTypes from 'prop-types'
import MNFile from '../MNFile'
import withFormikField from '~/utils/hoc/withFormikField'
import api from '~/utils/api'
import { mediaObjectType } from '~/types'

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
  value: mediaObjectType
}

const defaultProps = {
  id: 'image',
  value: null
}

const ImageInput = ({ label, onLoadEnd, name: inputName, id, value: media }) => {
  const classes = useStyles()

  const handleChange = async (s, files) => {
    const { name: imageName, url: data } = files[0]
    const res = await api.uploadMedia({ imageName, data })

    onLoadEnd(res || media)
  }

  const handleRemove = removePreview => name => async event => {
    const success = await api.removeMedia(media.id)
    if (success) {
      removePreview(name)(event)
      onLoadEnd(null)
    }
  }

  return (
    <MNFile
      label={
        <Button variant="outlined" color="primary" size="small" component="span">
          <Add className={classes.icon} />
          {label}
        </Button>
      }
      input={<FormikInputFile accept="images/*" name={inputName} id={id} onChange={handleChange} />}
    >
      {(images, removePreview) => {
        return (
          media &&
          images.map(({ name, url }) => (
            <Box boxShadow={1} key={name} className={classes.imgContainer}>
              <img src={url} alt="fichier téléchargé" className={classes.img} />
              <IconButton size="small" className={classes.imgClose} onClick={handleRemove(removePreview)(name)}>
                <Close />
              </IconButton>
            </Box>
          ))
        )
      }}
    </MNFile>
  )
}

ImageInput.propTypes = propTypes
ImageInput.defaultProps = defaultProps
export default ImageInput
