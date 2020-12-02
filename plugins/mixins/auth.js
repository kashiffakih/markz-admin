import Vue from 'vue'
import { mapGetters } from 'vuex'

const Authentication = {
  install(Vue, options) {
    Vue.mixin({
      computed: {
        ...mapGetters({
          authenticated: 'auth/authenticated',
          user: 'auth/user'
        })
      }
    })
  }
}

Vue.use(Authentication)