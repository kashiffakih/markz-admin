export const state = () => ({
  loggedIn: false,
  strategy: "local",
  user: null
})

export const getters = {
  authenticated(state) {
    return state.loggedIn
  },
  user(state) {
    return state.user
  }
}