import Vue from 'vue'
import { mapGetters } from 'vuex'

const Authentication = {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        authenticated() {
          return this.$auth && this.$auth.loggedIn
        },
        user() {
          return this.$auth && this.$auth.user
        }
      }
    })
  }
}

Vue.use(Authentication)