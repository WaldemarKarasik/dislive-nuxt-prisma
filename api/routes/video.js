const router = require('express').Router()
const PrismaClient = require('@prisma/client').PrismaClient
const jwt = require('jsonwebtoken')
router.post('/create', async (req, res) => {
  const { name, src } = req.body
  try {
    const prisma = new PrismaClient()
    const userToken = await jwt.verify(req.cookies.user, 'komsomolradio')
    const user = await prisma.user.findOne({
      where: { email: userToken.sub },
      include: { channel: true },
    })
    if (!user.channel) {
      throw new Error('У вас нет канала')
    }
    const channel = await prisma.channel.findOne({
      where: { id: user.channel.id },
    })
    const newVideo = await prisma.video.create({
      data: {
        name,
        src,
        channel: {
          connect: { id: channel.id },
        },
      },
    })
    const userToSendToFronted = await prisma.user.findOne({
      where: { id: user.id },
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
    const videoToSendToFrontend = await prisma.video.findOne({
      where: { id: newVideo.id },
      include: { channel: true },
    })
    return res.json({ user: userToSendToFronted, video: videoToSendToFrontend })
  } catch (e) {
    return res.status(500).json(e.message)
  }
})

router.post('/all', async (req, res) => {
  const prisma = new PrismaClient()
  const { skip = 0 } = req.body
  try {
    const videos = await prisma.video.findMany({
      include: { channel: { include: { user: true } } },
      skip,
      take: 5,
      orderBy: { createdAt: 'desc' },
    })
    return res.json(videos)
  } catch (e) {
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
})

router.get('/:id', async (req, res) => {
  // const video = await req.videoModel
  //   .findOne({ _id: req.params.id })
  //   .populate({ path: 'channel', populate: ['owner', 'subscribers'] })
  // return res.json(video)
  const prisma = new PrismaClient()

  try {
    const video = await prisma.video.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: {
        channel: { include: { user: true, subscribers: true } },
      },
    })
    if (!video) {
      throw new Error('Видео не найдено')
    }
    const likes = await prisma.like.findMany({
      where: { videoId: video.id },
    })
    const dislikes = await prisma.dislike.findMany({
      where: { videoId: video.id },
    })
    return res.json({ video, likes, dislikes })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
})

router.post('/:id/delete', async (req, res) => {
  const { id } = req.params
  const prisma = new PrismaClient()
  try {
    const deleteRelatedLikes = await prisma.like.deleteMany({
      where: { videoId: parseInt(id, 10) },
    })
    const deleteRelatedDislikes = await prisma.dislike.deleteMany({
      where: { videoId: parseInt(id, 10) },
    })
    const deleteRelatedPosts = await prisma.post.deleteMany({
      where: { videoId: parseInt(id, 10) },
    })
    const deletedVideo = await prisma.video.delete({
      where: { id: parseInt(id, 10) },
    })
    // const deletedVideo = await prisma.$queryRaw`DELETE FROM Video WHERE Video.id = ${parseInt(id, 10)}`
    return res.json(deletedVideo)
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect
  }
})

router.post('/:id/like', async (req, res) => {
  const { id } = req.params
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
    const dislikeAlreadyExists = await prisma.dislike.findMany({
      where: {
        userId: user.id,
        videoId: parseInt(id, 10),
      },
    })
    if (dislikeAlreadyExists.length) {
      const deleteDislike = await prisma.dislike.delete({
        where: {
          id: dislikeAlreadyExists[0].id,
        },
      })
    }
    const likeAlreadyExists = await prisma.like.findMany({
      where: {
        userId: user.id,
        videoId: parseInt(id, 10),
      },
    })
    if (likeAlreadyExists.length) {
      const deleteLike = await prisma.like.delete({
        where: {
          id: likeAlreadyExists[0].id,
        },
      })
      const likes = await prisma.like.findMany({
        where: { videoId: parseInt(id, 10) },
      })
      const dislikes = await prisma.dislike.findMany({
        where: { videoId: parseInt(id, 10) },
      })
      return res.json({ likes, dislikes })
    }
    const newLike = await prisma.like.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        video: {
          connect: { id: parseInt(id, 10) },
        },
      },
    })
    const likes = await prisma.like.findMany({
      where: { videoId: parseInt(id, 10) },
    })
    const dislikes = await prisma.dislike.findMany({
      where: { videoId: parseInt(id, 10) },
    })
    return res.json({ likes, dislikes })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect
  }
})

router.post('/:id/dislike', async (req, res) => {
  const { id } = req.params
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

    const likeAlreadyExists = await prisma.like.findMany({
      where: {
        userId: user.id,
        videoId: parseInt(id, 10),
      },
    })
    if (likeAlreadyExists.length) {
      const deleteLike = await prisma.like.delete({
        where: {
          id: likeAlreadyExists[0].id,
        },
      })
    }
    const dislikeAlreadyExists = await prisma.dislike.findMany({
      where: {
        userId: user.id,
        videoId: parseInt(id, 10),
      },
    })
    if (dislikeAlreadyExists.length) {
      const deleteDislike = await prisma.dislike.delete({
        where: {
          id: dislikeAlreadyExists[0].id,
        },
      })
      const dislikes = await prisma.dislike.findMany({
        where: { videoId: parseInt(id, 10) },
      })
      const likes = await prisma.like.findMany({
        where: { videoId: parseInt(id, 10) },
      })
      return res.json({ likes, dislikes })
    }
    const newDislike = await prisma.dislike.create({
      data: {
        user: {
          connect: { id: user.id },
        },
        video: {
          connect: { id: parseInt(id, 10) },
        },
      },
    })
    const dislikes = await prisma.dislike.findMany({
      where: { videoId: parseInt(id, 10) },
    })
    const likes = await prisma.like.findMany({
      where: { videoId: parseInt(id, 10) },
    })
    return res.json({ likes, dislikes })
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect
  }
})

router.post('/posts', async (req, res) => {
  const prisma = new PrismaClient()
  const { skip = 0, videoId } = req.body
  try {
    const posts = await prisma.post.findMany({
      where: {
        videoId,
      },
      skip,
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        channel: { include: { user: true } },
      },
    })
    return res.json(posts)
  } catch (e) {
    console.log(e.message)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect
  }
})

module.exports = router
