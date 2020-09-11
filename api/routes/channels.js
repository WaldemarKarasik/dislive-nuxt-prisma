const router = require('express').Router()
const PrismaClient = require('@prisma/client').PrismaClient
const jwt = require('jsonwebtoken')
router.post('/create', async (req, res) => {
  const { name } = req.body
  try {
    const prisma = new PrismaClient()
    const channelExists = await prisma.channel.findOne({ where: { name } })
    if (channelExists) {
      throw new Error('Канал уже существует')
    }
    const userToken = await jwt.verify(req.cookies.user, 'komsomolradio')
    const user = await prisma.user.findOne({ where: { email: userToken.sub } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }
    const newChannel = await prisma.channel.create({
      data: {
        name,
        user: {
          connect: { id: user.id },
        },
      },
    })
    const userToSendToFronted = await prisma.user.findOne({
      where: { id: user.id },
      include: {
        channel: true,
        subscribtions: true,
      },
    })
    return res.json(userToSendToFronted)
  } catch (e) {
    return res.status(500).json(e.message)
  }
})

router.post('/subscribe', async (req, res) => {
  const { channelId, videoId } = req.body
  try {
    const prisma = new PrismaClient()
    const userToken = await jwt.verify(req.cookies.user, 'komsomolradio')
    const user = await prisma.user.findOne({ where: { email: userToken.sub } })
    const updateChannel = await prisma.channel.update({
      where: { id: channelId },
      data: {
        subscribers: {
          connect: [{ id: user.id }],
        },
      },
    })
    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscribtions: {
          connect: [{ id: updateChannel.id }],
        },
      },
    })
    const videoToSendToFrontend = await prisma.video.findOne({
      where: { id: videoId },
      include: { channel: { include: { subscribers: true, user: true } } },
    })
    const userToSendToFronted = await prisma.user.findOne({
      where: { id: user.id },
      include: {
        channel: { include: { videos: true, subscribers: true } },
        subscribtions: true,
      },
    })
    return res.json({ video: videoToSendToFrontend, user: userToSendToFronted })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  }
})

router.post('/unsubscribe', async (req, res) => {
  const { channelId, videoId } = req.body
  try {
    const prisma = new PrismaClient()
    const userToken = await jwt.verify(req.cookies.user, 'komsomolradio')
    const user = await prisma.user.findOne({ where: { email: userToken.sub } })
    if (!user) {
      throw new Error('Пользователь не найден')
    }
    const channel = await prisma.channel.update({
      where: { id: channelId },
      data: {
        subscribers: {
          disconnect: [{ id: user.id }],
        },
      },
    })
    // const unsubscribeUser = await prisma.user.update({
    //   where: { email: user.email },
    //   data: {
    //     subscribtions: {
    //       disconnect: [{ id: channel.id }],
    //     },
    //   },
    // })

    const userToSendToFronted = await prisma.user.findOne({
      where: { email: user.email },
      include: { channel: { include: { videos: true } }, subscribtions: true },
    })

    const videoToSendToFrontend = await prisma.video.findOne({
      where: { id: videoId },
      include: { channel: { include: { subscribers: true, user: true } } },
    })

    return res.json({
      video: videoToSendToFrontend,
      user: userToSendToFronted,
    })
  } catch (e) {
    console.log(e)
    return res.status(500).json(e.message)
  }
})

module.exports = router
