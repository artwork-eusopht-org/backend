const bycrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const { getUserByEmail, createUser } = require("../services/userService")

module.exports = {
    signupUser: async (req, res) => {
        const { email, password, userData, redirectUrl } = req.body;
        const { full_name, user_type } = userData;
        console.log("req body", req.body)

        try {
            // check if user already exists
            const getUserByEmailRes = await getUserByEmail(email)
            console.log("getUserByEmailRes", getUserByEmailRes) ;
            if (getUserByEmailRes.length > 0) {
                return res.send({
                    status: 400,
                    message: "User already exists",
                    data: []
                })
            };
            const salt = await bycrypt.genSalt(10)
            const hashedPassword = await bycrypt.hash(password, salt)
            console.log("hashedPassword", hashedPassword)

            const createUserRes = await createUser(full_name, email, hashedPassword)
            console.log("createUserRes", createUserRes)

            var token = jwt.sign({ email }, process.env.JWT_SECRET)

            res.send({
                status: 200,
                message: "signupUser Api is working",
                token
            })
        }
        catch (e) {
            console.log(e.message)
            res.send({
                status: 500,
                message: e.message,
            })
        }
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body
        console.log("req body", req.body)

        try {
            // get user by email
            const getUserByEmailRes = await getUserByEmail(email)
            console.log("getUserByEmailRes", getUserByEmailRes[0])

            if (getUserByEmailRes.length === 0) {
                return res.send({
                    status: 401,
                    message: "User not found",
                    token: null
                })
            }

            const checkPassword = await bycrypt.compare(password, getUserByEmailRes[0].password);
            console.log("Test hash:", checkPassword);

            if (!checkPassword) {
                return res.send({
                    status: 401,
                    message: "Invalid password",
                    token: null
                })
            }

            // use userdata to create jwt token
            var token = jwt.sign({ email }, process.env.JWT_SECRET)
            // console.log("token", token)
            
            res.send({
                user: getUserByEmailRes[0],
                status: 200,
                message: "Success",
                token
            })

        }
        catch (e) {
            console.log(e.message)
            res.send({
                status: 500,
                message: e.message,
            })
        }
    },
    getUserData: async (req, res) => {
        const email = req.params.email
        console.log("req body", email)

        try {
            const serviceRes = await getUserByEmail(email)
            console.log(serviceRes)

            if (serviceRes.length === 0) {
                return res.send({
                    status: 200,
                    message: "User not found",
                    data: []
                })
            }

            res.send({
                status: 200,
                message: "User found",
                data: serviceRes
            })

        }
        catch (e) {
            console.log(e.message)
            res.send({
                status: 500,
                message: e.message,
            })
        }
    },

    logoutUser: (req, res) => {
        // In a real application, you would handle token invalidation here
        res.send({
            status: 200,
            message: "User logged out successfully"
        })
    }
}