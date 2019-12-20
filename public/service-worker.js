/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "android-chrome-192x192.png",
    "revision": "eea178315f46827e0fdcc7898bdb8b7e"
  },
  {
    "url": "android-chrome-512x512.png",
    "revision": "46189896da48a6212e7316add1db4202"
  },
  {
    "url": "apple-touch-icon.png",
    "revision": "fbc22162fbdef9b301dc4d371971a571"
  },
  {
    "url": "browserconfig.xml",
    "revision": "5645c9d0f6d7ff284177266cfe19164c"
  },
  {
    "url": "favicon-16x16.png",
    "revision": "296905f826523b35aaa2750120c317a7"
  },
  {
    "url": "favicon-32x32.png",
    "revision": "8fed56dbc93269cb3876004b47c8d97b"
  },
  {
    "url": "favicon.ico",
    "revision": "932f0f8126159fc4933dac853bcf8812"
  },
  {
    "url": "manifest.json",
    "revision": "c3a2a96bda89f5250214793924d2e0bd"
  },
  {
    "url": "mstile-150x150.png",
    "revision": "3dd152ed5fe35cbbcf265ba5bf2699af"
  },
  {
    "url": "robots.txt",
    "revision": "3ad0652bd17ff826a31fa29366021cfd"
  },
  {
    "url": "safari-pinned-tab.svg",
    "revision": "971126dbfa79a8da52c2b3be635f84d7"
  },
  {
    "url": "static/compostri.svg",
    "revision": "a6b63b9d46f26e75f477baa6127bee82"
  },
  {
    "url": "static/logo-mini.svg",
    "revision": "ee405879460d5a3fab4d3479c13bdf9c"
  },
  {
    "url": "static/logo.svg",
    "revision": "22f7472625d5f5d2bef75229f67a81fd"
  },
  {
    "url": "static/logo2.svg",
    "revision": "78f347976f17a7082d78daf12c7e5ed2"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
