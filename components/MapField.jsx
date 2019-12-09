import React, { useState } from 'react'
import RoomIcon from '@material-ui/icons/Room'
import ReactMapGL, { Marker, NavigationControl } from 'react-map-gl'
import { makeStyles } from '@material-ui/styles'

import { composterType } from '~/types'

const useStyles = makeStyles(({ spacing }) => ({
  navigationControl: {
    position: 'absolute',
    right: spacing(2),
    bottom: spacing(5)
  }
}))

const MapField = ({ record }) => {
  const { lat, lng } = record
  const [mapViewport, setMapViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: lat,
    longitude: lng,
    zoom: 12,
    bearing: 0,
    pitch: 0
  })
  const classes = useStyles()

  return (
    <ReactMapGL
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...mapViewport}
      onViewportChange={viewport => setMapViewport(viewport)}
      mapStyle={process.env.NEXT_STATIC_MAP_BOX_STYLE}
      mapboxApiAccessToken={process.env.NEXT_STATIC_MAP_BOX_TOKEN}
    >
      <Marker latitude={lat} longitude={lng}>
        <RoomIcon color="primary" />
      </Marker>
      <div className={classes.navigationControl}>
        <NavigationControl />
      </div>
    </ReactMapGL>
  )
}

MapField.propTypes = {
  record: composterType.isRequired
}

export default MapField
