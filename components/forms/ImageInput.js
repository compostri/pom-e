import React from 'react'
import { InputLabel, Button, FormControl } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Add } from '@material-ui/icons'
import ScalingUpload from '~/components/forms/ScalingUpload'

const useStyles = makeStyles({
  icon: {
    width: 15,
    marginRight: 10
  }
})

export default function ImageInput({ value, name, onUpload, multiple, label = 'Image' }) {
  const classes = useStyles()

  return (
    <FormControl margin="normal" fullWidth>
      <InputLabel shrink htmlFor={name}>
        {label}
      </InputLabel>

      <div>
        <ScalingUpload id={name} src={multiple ? value : [{img: value}]} multiple={multiple} onLoadEnd={onUpload} maxHeight={1200} maxWidth={2000} />
        <label htmlFor={name}>
          {multiple ? (
            <Button variant="outlined" color="primary" size="small" component="span">
              <Add className={classes.icon} />
              Ajouter un/des fichier(s)
            </Button>
          ) : !value ? (
            <Button variant="outlined" color="primary" size="small" component="span">
              <>
                <Add className={classes.icon} />
                Ajouter un fichier
              </>
            </Button>
          ) : null}
        </label>
      </div>
    </FormControl>
  )
}
