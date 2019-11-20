import React, { useState } from 'react'
import { InputLabel, Button, Box, IconButton, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Add, Close } from '@material-ui/icons'

import PropTypes from 'prop-types'
import api from '~utils/api'

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

export default function ImageInput({ value, name, label, onUpdate }) {
  const classes = useStyles()
  const [isLoading, setLoading] = useState()

  const upload = async e => {
    setLoading(true)
    let formData = new FormData()
    formData.append('file', e.target.files[0])
    const res = await api.uploadMedia(formData)
    if (res.status === 201) {
      onUpdate(res.data)
    }
    setLoading(false)
  }

  const remove = async id => {
    setLoading(true)
    const res = await api.removeMedia(id)
    if (res.status === 204) {
      onUpdate(null)
    }
    setLoading(false)
  }

  const renderPreview = () => {
    return (
      value && (
        <Box>
          <Box boxShadow={1} className={classes.imgContainer}>
            <img src={`${process.env.NEXT_STATIC_API_URL}/${value.contentUrl}`} alt="Composteur" className={classes.img} />
            <IconButton size="small" className={classes.imgClose} onClick={() => remove(value.id)}>
              <Close />
            </IconButton>
          </Box>
        </Box>
      )
    )
  }

  const displayUploadBtn = () => {
    return (
      <Box mt={1}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button variant="outlined" color="primary" size="small" component="span">
            <Add className={classes.icon} />
            Ajouter un fichier
          </Button>
        )}
      </Box>
    )
  }

  return (
    <>
      <InputLabel shrink htmlFor={name}>
        {label}
      </InputLabel>

      {renderPreview()}

      <div>
        <input id={name} type="file" multiple={multiple} accept="image/*" style={{ display: 'none' }} onChange={upload} />
        <label htmlFor={name}>{!value && displayUploadBtn()}</label>
      </div>
    </>
  )
}

ImageInput.propTypes = {
  value: PropTypes.shape({
    id: PropTypes.number.isRequired,
    contentUrl: PropTypes.string.isRequired
  }),
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  onUpdate: PropTypes.func.isRequired
}

ImageInput.defaultProps = {
  label: 'Image',
  value: null
}
