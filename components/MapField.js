import React from 'react'
import RoomIcon from '@material-ui/icons/Room'
import ReactMapGL, { Marker } from 'react-map-gl'

const MapField = ({ record }) => {
  const { lat, lng } = record
  return (
    <ReactMapGL latitude={lat} longitude={lng} width="100%" height="100%" zoom={12} mapboxApiAccessToken={process.env.NEXT_STATIC_MAP_BOX_TOKEN}>
      <Marker latitude={lat} longitude={lng}>
        <RoomIcon color="primary" />
      </Marker>
    </ReactMapGL>
  )
}

export default MapField
