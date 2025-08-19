const express = require("express")
const router = express.Router()

router.use('/user', require('./routes/userRoutes'))
router.use('/artworks', require('./routes/artworksRoutes'))

module.exports = router