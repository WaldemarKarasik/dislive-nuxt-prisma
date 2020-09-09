const Axios = require('axios')
const cookieParser = require('cookieparser')
export const actions = {
  async nuxtServerInit({ commit }, { req, env }) {
    try {
      const cookies =
        (req.headers.cookie && cookieParser.parse(req.headers.cookie)) || null
      let user = (cookies && cookies.user) || null
      if (user) {
        const res = await Axios.post(`${env.baseUrl}/api/auth/me`, {
          userToken: user,
        })
        if (res.data.ok) {
          await commit('user/SET_USER', res.data.user)
        }
      }
    } catch (e) {
      console.log(e.message)
    }
  },
}
