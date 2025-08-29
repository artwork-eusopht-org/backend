const express = require("express")
const verifyToken = require('../middlewares/verifyToken')
const multer = require('multer');
const path = require('path');
// const app = express
const router = express.Router()
const {
  createArtwork,
  getArtworks,
  getspecificArtWork,
  makeArtWorkOffer,
  fetchAllOffers,
  respondArtWorkOffer
} = require("../controllers/artworksController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/add-artwork", upload.none(), createArtwork);
router.get("/", getArtworks);
router.get("/get-artwork/fetch-all-offers", fetchAllOffers);
router.get("/get-artwork/:id", getspecificArtWork);
router.post("/make-offer", upload.none(), makeArtWorkOffer);
router.post("/respond-offer", upload.none(), respondArtWorkOffer);
// router.post("/stripe-webhook", stripeWebhook);

// router.get("/list", getArtworks);
// router.get("/edit/:id", getArtworkById);
// router.put("/update/:id", updateArtwork);
// router.delete("/delete/:id", deleteArtwork);


module.exports = router
