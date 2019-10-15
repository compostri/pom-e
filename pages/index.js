import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Sidebar from '../components/sidebar'
import Nav from '../components/nav'

import { Box, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import palette from '../variables'

import ReactMapGL, { Popup, Marker } from 'react-map-gl'
import axios from 'axios'

import mapStyle from '../static/map-style'
//import config from '~/config'

const useStyles = makeStyles(theme => ({
  mapContainer: {
    width: '500px',
    height: '500px',
    marginLeft: '500px',
    backgroundColor: 'wheat'
  }
}))

const Home = () => {
  const classes = useStyles()
  const [composters, setComposters] = useState([])
  const [mapViewport, setMapViewport] = useState({
    width: '100%',
    height: '100%',
    latitude: 47.41736,
    longitude: -1.84653,
    zoom: 7
  })

  useEffect(() => {
    fetchComposters()
  }, [])

  const fetchComposters = async () => {
    await axios.get('https://composteur-api.osc-fr1.scalingo.io/composters').then(res => {
      setComposters(res.data['hydra:member'])
    })
  }

  return (
    <div>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      <Nav />

      <Button variant="contained" color="primary">
        Se connecter
      </Button>

      <section className={classes.mapContainer}>
        <ReactMapGL
          {...mapViewport}
          mapStyle="mapbox://styles/mapbox/dark-v8"
          mapboxApiAccessToken={'pk.eyJ1IjoiY2hhcmxlcy1tbiIsImEiOiJjazFtNjQzZXEwYzF4M2xwb2ZvMXAyNmh0In0.14tRmBImasMw9lyWhRzxTQ'}
          onViewportChange={viewport => setMapViewport({ viewport })}
        />
      </section>

      <div className="hero">
        <ul>{composters && composters.map(({ key, name }) => <li key={key}>{name}</li>)}</ul>
      </div>
    </div>
  )
}

export default Home

/* <ul>{composters && composters.map(key => <li>{key}</li>)}</ul> */
