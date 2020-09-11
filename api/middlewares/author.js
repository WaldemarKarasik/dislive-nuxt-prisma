const PrismaClient = require('@prisma/client').PrismaClient
const jwt = require('jsonwebtoken')
module.exports = async (req, res, next) => {
  const prisma = new PrismaClient()
  try {
    const userToken = await jwt.verify(req.cookies.user, 'komsomolradio')
    const user = await prisma.user.findOne({
      where: { email: userToken.sub },
      include: { channel: true },
    })
    if (!user.channel) {
      throw new Error('У вас нет канала')
    }
    req.user = user
    next()
  } catch (e) {
    console.log(e)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
}
