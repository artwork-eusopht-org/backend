const express = require("express")
// const app = express
const router = express.Router()
const { 
  stripeWebhook
} = require("../controllers/stripeController");


router.post("/stripe-webhook", express.raw({ type: 'application/json' }), stripeWebhook);


module.exports = router
