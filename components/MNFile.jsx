/* eslint-disable no-undef */
import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'

const compress = (targetWidth, targetHeight) => async file => {
  const getReadableFile = f => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(f)
      reader.onload = event => resolve(event.target.result)
      reader.onError = error => reject(error)
    })
  }

  const getImageData = fileResult => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = fileResult
      img.onError = error => reject(error)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        let width
        let height

        if (img.width > img.height) {
          width = targetWidth
          height = Math.round((img.height / img.width) * width)
        } else {
          height = targetHeight
          width = Math.round((img.width / img.height) * height)
        }

        canvas.width = width
        canvas.height = height

        ctx.drawImage(img, 0, 0, width, height)

        ctx.globalAlpha = 0

        resolve({
          width: img.width,
          height: img.height,
          url: canvas.toDataURL()
        })
      }
    })
  }

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModifiedDate: file.lastModifiedDate,
    lastModified: file.lastModified,
    ...(await getImageData(await getReadableFile(file)))
  }
}

const propTypes = {
  input: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  targetWidth: PropTypes.number,
  targetHeight: PropTypes.number
}

const defaultProps = {
  targetWidth: 300,
  targetHeight: 300
}

const MNFile = ({ input, children, label, targetWidth, targetHeight }) => {
  const inputFileRef = useRef(null)
  const [previews, setPreviews] = useState([])

  const inputProps = input.props

  const remove = removedName => () => {
    const byName = ({ name }) => name !== removedName
    inputFileRef.current.value = ''

    setPreviews(previews.filter(byName))
  }

  const setRef = e => {
    if (input.props.ref) {
      input.props.ref(e)
    }
    inputFileRef.current = e
  }

  const handleChange = (handleLocaleChange, handleInputChange, width, height) => async event => {
    const {
      target: { files }
    } = event

    const allPreviews = await Promise.all([...files].map(compress(width, height)))
    handleLocaleChange(allPreviews)

    if (handleInputChange) {
      handleInputChange(event, allPreviews)
    }
  }

  const mayRenderPreviews = (prvws, removeFn) => prvws.length > 0 && children(prvws, removeFn)

  return (
    <>
      <input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...inputProps}
        ref={setRef}
        onChange={handleChange(setPreviews, inputProps.onChange, targetWidth, targetHeight)}
        type="file"
        style={{ display: 'none' }}
      />
      <label htmlFor={inputProps.name}>{label}</label>
      {mayRenderPreviews(previews, remove)}
    </>
  )
}

MNFile.propTypes = propTypes
MNFile.defaultProps = defaultProps
export default MNFile
