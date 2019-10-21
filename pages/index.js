import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../components/sidebar'

import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { RadioButtonChecked } from '@material-ui/icons'

import ReactMapGL, { Popup, Marker, Source, Layer } from 'react-map-gl'
import api from '../utils/api'

const useStyles = makeStyles(theme => ({
  mapContainer: {
    marginLeft: '0'
  },
  userButton: {
    position: 'fixed',
    top: '40px',
    right: '40px',
    zIndex: 150
  }
}))

const Home = ({ allCommunes }) => {
  const classes = useStyles()
  const [composters, setComposters] = useState(null)
  const [mapViewport, setMapViewport] = useState({
    width: '100%)',
    height: '100vh',
    latitude: 47.1890984,
    longitude: -1.5704894,
    zoom: 9,
    bearing: 0,
    pitch: 0
  })
  const [selectedCommune, setSelectedCommune] = useState(allCommunes[0].id)

  useEffect(() => {
    fetchComposters()
  }, [])

  const fetchComposters = async () => {
    const geojson = await api.getComposterGeojson()
    if (geojson.status === 200) {
      setComposters(geojson.data)
    }
  }
  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar commune={selectedCommune} setCommune={setSelectedCommune} allCommunes={allCommunes} />

      <Button variant="contained" color="secondary" className={classes.userButton}>
        Se connecter
      </Button>

      <section className={classes.mapContainer}>
        <ReactMapGL
          {...mapViewport}
          mapStyle={process.env.NEXT_STATIC_MAP_BOX_STYLE}
          mapboxApiAccessToken={process.env.NEXT_STATIC_MAP_BOX_TOKEN}
          onViewportChange={viewport => setMapViewport(viewport)}
        >
          {composters && (
            <Source type="geojson" data={composters}>
              <Layer
                {...{
                  id: 'data',
                  type: 'circle',
                  paint: {
                    'circle-radius': 8,
                    'circle-color': 'rgba(55,148,179,1)'
                  },
                  filter: ['==', 'commune', selectedCommune]
                }}
              />
            </Source>
          )}
        </ReactMapGL>
      </section>
    </div>
  )
}

Home.getInitialProps = async () => {
  const communes = await api.getCommunes()
  return { allCommunes: communes.data['hydra:member'] }
}

export default Home
