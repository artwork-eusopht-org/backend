const version = require("./package.json").version
console.log("Version", version)

const express = require("express")

require('dotenv').config()

const app = express()
const cors = require("cors")
const pool = require("./config/database");

const stripeRoutes = require('./routes/stripeRoutes');
app.use('/webhook', stripeRoutes);

app.use(cors())
app.use(express.json())

const port = process.env.PORT

const server = app.listen(port, function () {
    console.log(`The server is running on port ${port}`)
})

app.use('/api', require('./rootRoute'))
app.use('/uploads', express.static('uploads'));

const uiPath = __dirname + "/client/dist";
app.use(express.static(uiPath));
app.get("/*", async (req, res) => { res.sendFile(uiPath + "/index.html"); });


server.setTimeout(500000);
console.log("💻 Server timeout", server.timeout);

pool.query(`show databases`, (error, results, fields) => {
    if (error) {
        console.log("SQL Database error: ", error.message);
    } else {
        console.log("SQL Database connected");
    }
});