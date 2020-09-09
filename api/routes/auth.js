const router = require('express').Router()
const PrismaClient = require('@prisma/client').PrismaClient
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body
  const prisma = new PrismaClient()
  try {
    const user = await prisma.user.findOne({ where: { email } })
    if (user) {
      throw new Error('Email занят')
    }
    const hashedPass = await bcryptjs.hash(password, 10)
    const userToSendToFrontend = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPass,
      },
    })
    const hashedEmail = await jwt.sign(
      { sub: userToSendToFrontend.email },
      'komsomolradio'
    )
    res.cookie('user', hashedEmail, { httpOnly: true })
    return res.json(userToSendToFrontend)
  } catch (e) {
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
})

router.get('/me', async (req, res) => {
  const cookies = req.headers
  console.log(cookies)
  const prisma = new PrismaClient()
  try {
    if (!cookies.user) {
      throw new Error('Нет печеньки')
    }
    const { sub } = await jwt.verify(cookies.user, 'komsomolradio')
    const user = await prisma.user.findOne({
      where: { email: sub },
      include: { Channel: true },
    })
    if (!user) {
      throw new Error('Пользователь не найден')
    }
    return res.json({ ok: true, user })
  } catch (e) {
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
})

module.exports = router
