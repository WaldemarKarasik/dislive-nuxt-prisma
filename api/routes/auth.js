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
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
})

router.post('/me', async (req, res) => {
  const { userToken } = req.body
  const prisma = new PrismaClient()
  try {
    if (!userToken) {
      throw new Error('Нет печеньки')
    }
    const { sub } = await jwt.verify(userToken, 'komsomolradio')
    const user = await prisma.user.findOne({
      where: { email: sub },
      include: {
        channel: {
          include: {
            videos: true,
            subscribers: true,
          },
        },
        subscribtions: true,
      },
    })
    if (!user) {
      throw new Error('Пользователь не найден')
    }
    return res.json({ ok: true, user })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const prisma = new PrismaClient()

    const userExists = await prisma.user.findOne({
      where: { email },
      include: {
        channel: { include: { videos: true } },
        subscribtions: true,
      },
    })
    if (!userExists) {
      throw Error('Некорректные данные')
    }
    const isMatch = await bcryptjs.compare(password, userExists.password)
    if (!isMatch) {
      throw Error('Некорректные данные')
    }
    const hashedEmail = await jwt.sign(
      { sub: userExists.email },
      'komsomolradio'
    )
    res.cookie('user', hashedEmail, { httpOnly: true })
    return res.json(userExists)
  } catch (e) {
    return res.status(500).json(e.message)
  }
})

module.exports = router
