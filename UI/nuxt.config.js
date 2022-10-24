export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Beta | QuizzApp",
    htmlAttrs: {
      lang: "fr",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Kreon",
      },
    ],
    script: [
      {
        src: "https://cdn.socket.io/4.4.1/socket.io.min.js",
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: ["vue-ssr-carousel/nuxt"],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/proxy",
    // https://go.nuxtjs.dev/buefy
    "nuxt-buefy",
  ],
  proxy: {
    "/socket": {
      target: "http://localhost:3021",
      ws: true,
    },
  },
  server: {
    host: "0.0.0.0",
    port: 3020,
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
