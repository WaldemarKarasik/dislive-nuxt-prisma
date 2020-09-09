const Axios = require('axios')
export const actions = {
  nuxtServerInit({ commit }, { req, env }) {
    try {
      const res = fetch('http://localhost:3000/api/auth/me', {
        credentials: 'same-origin',
      })
    } catch (e) {
      console.log(e.message)
    }
  },
}
