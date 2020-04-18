const express = require('express')
const consola = require('consola')
const {
  Nuxt,
  Builder
} = require('nuxt')
const app = express()
const axios = require('axios')
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
const {
  IamAuthenticator
} = require('ibm-watson/auth');
const body_parser = require('body-parser')
app.use(body_parser.json())
app.use(body_parser.urlencoded({
  extended: true
}))

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host,
    port
  } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  // Express GET endpoint
  app.post('/api/ibm-nlu', async (req, res) => {

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
      version: '2019-07-12',
      authenticator: new IamAuthenticator({
        apikey: 'wZssRraFPfPDFlmdgZZdi5Drak-oaPxjjMcqTIU8yrhH',
      }),
      url: 'https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/31d4411e-361b-4e75-8810-94c3bf318611',
    });

    const analyzeParams = {
      'text': req.body.text,
      'features': {
        "sentiment": {},
        "keywords": {
          'limit': 20
        },
        "emotion": {
          'limit': 3
        }
      }
    };

    naturalLanguageUnderstanding.analyze(analyzeParams)
      .then(analysisResults => {
        res.json(analysisResults)
      })
      .catch(err => {
        res.json(err)
        console.log('error:', err);
      });
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
