const router = require('express').Router()
const PrismaClient = require('@prisma/client').PrismaClient
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const authorMiddleware = require('../middlewares/author')
router.post('/videos', async (req, res) => {
  const prisma = new PrismaClient()
  const { id } = req.body
  try {
    const userVideos = await prisma.video.findMany({
      where: { channelId: id },
    })
    return res.json(userVideos)
  } catch (e) {
    console.log(e)
    return res.status(500).json(e.message)
  } finally {
    await prisma.$disconnect()
  }
})

module.exports = router
