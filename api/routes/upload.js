const router = require('express').Router()

const Mux = require('@mux/mux-node')
const { Video } = new Mux()

router.put('', async (req, res) => {
  try {
    const upload = await Video.Uploads.create({
      new_asset_settings: { playback_policy: 'public' },
      cors_origin: '*',
    })
    res.json({
      id: upload.id,
      url: upload.url,
    })
  } catch (e) {
    res.statusCode = 500
    console.error('Request error', e)
    res.json({ error: 'Error creating upload' })
  }
})

router.get('/get-asset', async (req, res) => {
  try {
    const asset = await Video.Assets.get(req.query.id)
    res.json({
      asset: {
        id: asset.id,
        status: asset.status,
        errors: asset.errors,
        playback_id: asset.playback_ids[0].id,
      },
    })
  } catch (e) {
    res.statusCode = 500
    console.error('Request error', e)
    res.json({ error: 'Error getting upload/asset' })
  }
})

router.get('/get-upload', async (req, res) => {
  try {
    const upload = await Video.Uploads.get(req.query.id)
    res.json({
      upload: {
        status: upload.status,
        url: upload.url,
        asset_id: upload.asset_id,
      },
    })
  } catch (e) {
    res.statusCode = 500
    console.error('Request error', e)
    res.json({ error: 'Error getting upload/asset' })
  }
})

module.exports = router
