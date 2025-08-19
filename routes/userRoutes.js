const express = require("express")
const verifyToken = require('../middlewares/verifyToken')
// const app = express
const router = express.Router()

const { signupUser, loginUser, getUserData, logoutUser } = require("../controllers/userController")

router.post('/signup', signupUser)
router.post('/login', loginUser)
router.get('/getUserData/:email', verifyToken, getUserData)
router.post('/logout', logoutUser);


module.exports = router
