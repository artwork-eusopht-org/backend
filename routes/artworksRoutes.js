const express = require("express")
const verifyToken = require('../middlewares/verifyToken')
// const app = express
const router = express.Router()
const { 
  createArtwork, 
//   getArtworks, 
//   getArtworkById, 
//   updateArtwork, 
//   deleteArtwork 
} = require("../controllers/artworksController");

router.post("/add", createArtwork);
// router.get("/list", getArtworks);
// router.get("/edit/:id", getArtworkById);
// router.put("/update/:id", updateArtwork);
// router.delete("/delete/:id", deleteArtwork);


module.exports = router
