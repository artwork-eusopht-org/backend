require('dotenv').config()
const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const { authorization } = req.headers
    console.log("authorization", authorization)

    try {
        if (authorization) {
            if (authorization.indexOf("Bearer") === -1) {
                res.send({
                    status: 401,
                    message: "Unauthorized user"
                })
            }
            else {
                const token = authorization.slice(7)
                console.log("token", token)

                const decode = jwt.verify(token, process.env.JWT_SECRET)
                console.log(decode)

                next()
            }
        }
        else {
            res.send({
                status: 401,
                message: "Missing JWT token"
            })
        }
    }
    catch (e) {
        res.send({
            status: 500,
            message: e.message,
        })
    }
}

module.exports = verifyToken