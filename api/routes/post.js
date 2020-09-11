const router = require('express').Router()
const PrismaClient = require('@prisma/client').PrismaClient
const jwt = require('jsonwebtoken')

router.post('/new', async (req, res) => {
  const { videoId, content } = req.body
  const prisma = new PrismaClient()
  try {
    const userToken = await jwt.verify(req.cookies.user, 'komsomolradio')
    const user = await prisma.user.findOne({
      where: { email: userToken.sub },
      include: { channel: true },
    })
    if (!user) {
      throw new Error('Пользователь не найден')
    }
    if (user.channel) {
      const newPost = await prisma.post.create({
        data: {
          content,
          video: {
            connect: { id: videoId },
          },
          channel: {
            connect: { id: user.channel.id },
          },
        },
        include: {
          user: true,
          channel: { include: { user: true } },
        },
      })
      return res.json(newPost)
    }
    const newPost = await prisma.post.create({
      data: {
        content,
        video: {
          connect: { id: videoId },
        },
        user: {
          connect: { id: user.id },
        },
      },
      include: {
        user: true,
        channel: { include: { user: true } },
      },
    })
    return res.json(newPost)
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect
  }
})

router.post('/comments-count', async (req, res) => {
  const { postId } = req.body
  const prisma = new PrismaClient()
  try {
    const commentsCount = await prisma.comment.count({
      where: { postId },
    })
    return res.json(commentsCount)
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect
  }
})

module.exports = router
