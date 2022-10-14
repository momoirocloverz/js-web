export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '江山农业项目投资一件事',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [{ src: '/mapModule/plugin/gis/acol/acol.min.js' }]
  },

  loading: {
    color: '#0270C3'
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css', '~/assets/main.less', '~/assets/ele.less', '~/assets/spinkit.min.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/element-ui',
    { src: '~/plugins/vuex-persist', ssr: false },
    '~/plugins/apiList',
    '~/plugins/print',
    '~/plugins/dayjs',
    { src: '~/plugins/flexible', ssr: false },
    '@/plugins/v-viewer',
    { src: '~/plugins/vueqr', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: ['@nuxtjs/axios'],
  axios: {
    proxy: true
  },
  proxy: {
    '/web': {
    //   target: "https://jiangshan-tzyjs-web.zjsszxc.com",
      target: 'http://dev-jiangshan-tzyjs-apiweb.hzanchu.com',
      pathRewrite: { '^/web': '' },
      changeOrigin: true
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
    vendor: ['axios', 'element-ui', 'v-viewer'],
    // router: {
    //     extendRoutes (routes, resolve) {
    //       routes.push({
    //         name: 'mapModule.html',
    //         path: '/mapModule.html',
    //         // component: resolve(__dirname, 'pages/index.vue'),
    //         component: resolve(__dirname, '~/mapModule/PHJSC_final.html'),
    //       });
    //     },
    //   },
    postcss: {
      preset: {
        autoprefixer: true
      },
      plugins: {
        'postcss-px2rem-exclude': {
          remUnit: 192,
          //   exclude: /src[\/\\]views[\/\\]cockpit[\/\\](xcsz|waste-management)\.vue|src[\/\\]components[\/\\](Spinkit)|node_modules/
          exclude: /src[\/\\]components[\/\\](Spinkit|waste-management)\.vue/
        }
      }
    }
  }
}
