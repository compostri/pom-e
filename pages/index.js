import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../components/sidebar'

import { Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { RadioButtonChecked } from '@material-ui/icons'

import ReactMapGL, { Popup, Marker } from 'react-map-gl'
import axios from 'axios'

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

const Home = () => {
  const classes = useStyles()
  const [composters, setComposters] = useState([])
  const [mapViewport, setMapViewport] = useState({
    width: '100%)',
    height: '100vh',
    latitude: 47.1890984,
    longitude: -1.5704894,
    zoom: 9,
    bearing: 0,
    pitch: 0
  })

  useEffect(() => {
    fetchComposters()
  }, [])

  const fetchComposters = async () => {
    await axios.get('https://composteur-api.osc-fr1.scalingo.io/composters').then(res => {
      setComposters(res.data['hydra:member'].filter(c => c.lat && c.lng))
    })
  }

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />

      <Button variant="contained" color="primary" className={classes.userButton}>
        Se connecter
      </Button>

      <section className={classes.mapContainer}>
        <ReactMapGL
          {...mapViewport}
          mapStyle="mapbox://styles/arnaudban/cjmefzh8ykcic2sqq0i92vo1h"
          mapboxApiAccessToken={'pk.eyJ1IjoiYXJuYXVkYmFuIiwiYSI6ImNpbDB5NHZvdzAwOHZ3a201c2pmcW8xemIifQ.TIcJEgmjcYpNoXjlNUP_Wg'}
          onViewportChange={viewport => setMapViewport(viewport)}
        >
          {composters &&
            composters.map(composter => (
              <Marker key={composter.id} latitude={composter.lat} longitude={composter.lng}>
                <RadioButtonChecked />
              </Marker>
            ))}
        </ReactMapGL>
      </section>
    </div>
  )
}

export default Home
