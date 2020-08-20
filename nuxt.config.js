const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'stylesheet', href: '/plugins/fontawesome-free/css/all.min.css' },
      { rel: 'stylesheet', href: 'https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css' },
      { rel: 'stylesheet', href: '/plugins/overlayScrollbars/css/OverlayScrollbars.min.css' },
      { rel: 'stylesheet', href: '/dist/css/adminlte.min.css' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700' },
    ],
    script: [
      { src: '/plugins/jquery/jquery.min.js' },
      { src: '/plugins/bootstrap/js/bootstrap.bundle.min.js' },
      { src: '/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js' },
      { src: '/plugins/inputmask/min/jquery.inputmask.bundle.min.js' },
      { src: '/plugins/jquery-mousewheel/jquery.mousewheel.js' },
      { src: '/plugins/raphael/raphael.min.js' },
      { src: '/plugins/jquery-mapael/jquery.mapael.min.js' },
      { src: '/plugins/jquery-mapael/maps/usa_states.min.js' },
      { src: '/plugins/chart.js/Chart.min.js' },
      { src: '/dist/js/pages/dashboard2.js' },
      { src: '/dist/js/demo.js' },
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { 
    continuous: 'true',
    color: 'red',
    height: '4px'
  },

  /*
  ** Global CSS
  */
  css: [
  ],

  router: {
    middleware: [
      'clearValidationErrors',
      'auth',
      'organization'
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/mixins/validation',
    '@/plugins/mixins/auth',
    '@/plugins/mixins/settings',
    '@/plugins/axios',
    '@/plugins/charts',
    '@/plugins/vue-select',
    '@/plugins/mask',
    { src: '@/plugins/carousel3d', ssr: false },
    { src: '@/plugins/vue-json-excel', ssr: false },
    { src: "@/plugins/vue2-google-maps.js", ssr: false},
    { src: '@/plugins/datepicker', ssr: false }
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: '/login', method: 'post', propertyName: 'token'},
          logout: {url: '/logout', method: 'get'},
          user: {url: '/me', method: 'get', propertyName: 'data'},
        }
      }
    },
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/'
    }
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],

  axios: {
    baseURL: 'https://api.foodor.in/api'
    // baseURL: 'http://localhost:8080/api'
    // baseURL: 'http://192.168.29.9:8080/api'
  },
  
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      transpile: [/^vue2-google-maps($|\/)/]
    },
  },
}
// 