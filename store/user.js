export const state = () => ({
  user: null,
  loggedIn: false,
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
    // if (user.channel) {
    //   state.user.channel = user.channel
    // }
    state.loggedIn = true
  },
  // CHANGE_LOGGED_IN(state, condition) {
  //   state.loggedIn = condition
  // },
  LOGOUT(state) {
    state.user = null
    state.loggedIn = false
  },
  USER_CREATED_CHANNEL(state, channel) {
    state.user.channel = channel
  },
}
export const getters = {
  GET_USER(state) {
    return state.user
  },
  GET_AUTH_STATE(state) {
    return state.loggedIn
  },
}
