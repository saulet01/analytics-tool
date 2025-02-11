const colors = require('vuetify/es5/util/colors').default



module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{
    src: '~/plugins/vue-html2canvas',
    ssr: false
  }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          alt: "#DF5060",
          neutral: "#fe7d3b"
        },
        light: {
          primary: colors.blue.darken2,
          warning: colors.amber.base,
          alt: "#DF5060",
          neutral: "#fe7d3b"
        }
      }
    },
    defaultAssets: {
      icons: 'fa'
    }
  },
  transition: {
    name: 'slide-x-transition'
  },
  /*
   ** Build configuration
   */
  build: {
    analyze: true,
    extractCSS: true,
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      config = {
        module: {
          rules: [{
            test: /\.csv$/,
            loader: 'csv-loader',
            options: {
              dynamicTyping: true,
              header: true,
              skipEmptyLines: true
            }
          }]
        }
      }
    }
  },

}
