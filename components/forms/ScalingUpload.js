import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Close } from '@material-ui/icons'
import { Box, IconButton, Grid } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
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
  img: {
    width: '100%',
    height: 'auto',
    display: 'block'
  }
}))

function getOrientation(file) {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()
    reader.onload = function(e) {
      var view = new DataView(e.target.result)
      if (view.getUint16(0, false) !== 0xffd8) {
        resolve(-2)
      }
      var length = view.byteLength,
        offset = 2
      while (offset < length) {
        if (view.getUint16(offset + 2, false) <= 8) resolve(-1)
        var marker = view.getUint16(offset, false)
        offset += 2
        if (marker === 0xffe1) {
          if (view.getUint32((offset += 2), false) !== 0x45786966) {
            resolve(-1)
          }

          var little = view.getUint16((offset += 6), false) === 0x4949
          offset += view.getUint32(offset + 4, little)
          var tags = view.getUint16(offset, little)
          offset += 2
          for (var i = 0; i < tags; i++) {
            if (view.getUint16(offset + i * 12, little) === 0x0112) {
              resolve(view.getUint16(offset + i * 12 + 8, little))
            }
          }
        } else if ((marker & 0xff00) !== 0xff00) {
          break
        } else {
          offset += view.getUint16(offset, false)
        }
      }
      resolve(-1)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 *
 * @param {*} image
 * @param {*} maxWidth
 * @param {*} maxHeight
 * @param {*} quality
 * @param {*} orientation
 */
const resizeImage = (image, name, maxWidth, maxHeight, quality, orientation = -1) => {
  let canvas = document.createElement('canvas')
  let width = image.width
  let height = image.height

  if (width > height) {
    if (width > maxWidth) {
      height = Math.round((height * maxWidth) / width)
      width = maxWidth
    }
  } else {
    if (height > maxHeight) {
      width = Math.round((width * maxHeight) / height)
      height = maxHeight
    }
  }

  // set proper canvas dimensions before transform & export
  if (4 < orientation && orientation < 9) {
    canvas.width = height
    canvas.height = width
  } else {
    canvas.width = width
    canvas.height = height
  }

  // transform context before drawing image
  let ctx = canvas.getContext('2d')
  switch (orientation) {
    case 2:
      ctx.transform(-1, 0, 0, 1, width, 0)
      break
    case 3:
      ctx.transform(-1, 0, 0, -1, width, height)
      break
    case 4:
      ctx.transform(1, 0, 0, -1, 0, height)
      break
    case 5:
      ctx.transform(0, 1, 1, 0, 0, 0)
      break
    case 6:
      ctx.transform(0, 1, -1, 0, height, 0)
      break
    case 7:
      ctx.transform(0, -1, -1, 0, height, width)
      break
    case 8:
      ctx.transform(0, -1, 1, 0, 0, width)
      break
    default:
      break
  }

  ctx.drawImage(image, 0, 0, width, height)

  return { img: canvas.toDataURL('image/jpeg', quality), name, new: true }
}

const getResizedImage = (event, name, orientation, maxWidth, maxHeight) => {
  return new Promise(resolve => {
    let dataUrl = event.target.result
    let image = new Image()
    image.onload = function() {
      const resizedDataUrl = resizeImage(image, name, maxWidth, maxHeight, 0.9, orientation)
      resolve(resizedDataUrl)
    }
    image.src = dataUrl
  })
}

const resize = async (file, orientation, maxWidth, maxHeight) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.onload = async function(event) {
      const resizedDataUrl = await getResizedImage(event, file.name, orientation, maxWidth, maxHeight)
      resolve(resizedDataUrl)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * This hook is able to preview an image and resize it before someone will send it to the server.
 * It will preserve the aspect ratio
 *
 * @author Matière Noire - Original author Hacks Mozilla
 * @see https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
 * @verions 1.0
 */
export default function ScalingUpload(props) {
  const classes = useStyles()
  const [value, setValue] = useState('')

  const onChange = async e => {
    // target.files is FileList type (not an array), but conformes to
    const promises = Array.from(e.target.files).map(async file => {
      var maxWidth = props.maxWidth
      var maxHeight = props.maxHeight
      const orientation = await getOrientation(file)
      return await resize(file, orientation, maxWidth, maxHeight)
    })
    const images = await Promise.all(promises)
    setValue('')
    props.onLoadEnd([...props.src, ...images])
  }

  const remove = index => {
    const images = [...props.src]
    images.splice(index)
    props.onLoadEnd(images)
  }

  return (
    <div className={classes.field}>
      <input id={props.id} value={value} type="file" multiple={props.multiple} accept="image/*" style={{ display: 'none' }} onChange={onChange} />
      <Box my={2}>
        <Grid container spacing={2}>
          {props.src.map((image, index) => {
            return (
              <Grid item xs={12} sm={6} md={3} key={`image-${index}`}>
                <Box boxShadow={1} style={{ position: 'relative' }}>
                  <img src={image.img} className={classes.img} />
                  <IconButton size="small" className={classes.imgClose} onClick={() => remove(index)}>
                    <Close></Close>
                  </IconButton>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </div>
  )
}
