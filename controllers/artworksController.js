const bycrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");

const { createArtworkService, getArtworksService, getSpecificArtworkService, createArtworkOfferService, fetchAllOffersService, respondArtWorkOfferService, getSpecificArtWorkOfferService } = require("../services/artworksService");
const { offerAccept, offerReject, offerRecieved } = require('./emailTemplate');

module.exports = {
    createArtwork: async (req, res) => {
        try {
            const { title, artist, year, medium, dimensions, description, minPrice, offerStatus } = req.body;
            console.log("req body", req.body)
            const firstFileName = req.files[0].filename;
            console.log("imageName", firstFileName); 
            
            const createArtWork = await createArtworkService(title, artist, year, medium, dimensions, firstFileName, description, minPrice, offerStatus)
            // console.log("createArtWork", createArtWork)

            res.send({
                status: 200,
                message: "Artwork Added",
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
    getArtworks: async (req, res) => {
        try {
            const artworkRes = await getArtworksService()
            console.log(artworkRes)

            if (artworkRes.length === 0) {
                return res.send({
                    status: 200,
                    message: "Artworks not found",
                    data: []
                })
            }

            res.send({
                status: 200,
                message: "ArtWorks found",
                data: artworkRes
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
    getspecificArtWork: async (req, res) => {
        try {
            const id = req.params.id;
            console.log("Artwork ID:", id);

            const artworkRes = await getSpecificArtworkService(id)
            console.log(artworkRes)

            if (artworkRes.length === 0) {
                return res.send({
                    status: 200,
                    message: "Artworks not found",
                    data: []
                })
            }

            res.send({
                status: 200,
                message: "ArtWorks found",
                data: artworkRes
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
    makeArtWorkOffer: async (req, res) => {
        try {
            const { name, email, phone, offer, notes, art_id } = req.body;
            console.log("req body", req.body)
            
            const createArtWorkOffer = await createArtworkOfferService(name, email, phone, offer, notes, art_id)
            // console.log("createArtWork", createArtWork)

            let transporter = nodeMailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: false,
                auth: { 
                    user:process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });
            
            let html = offerRecieved(name, offer);
            mailOptions = { from: process.env.MAIL_USER, to: [process.env.MAIL_USER, "umar.maqsood06@gmail.com"], subject: "Offer Received", html: html };
            await transporter.sendMail(mailOptions);

            res.send({
                status: 200,
                message: "Offer Submitted",
            })
        }
        catch (e) {
            console.log(e.message)
            res.send({
                status: 500,
                message: "Please Try Again",
            })
        }
    },
    fetchAllOffers: async (req, res) => {
        try {
            const offersRes = await fetchAllOffersService()
            console.log(offersRes)

            if (offersRes.length === 0) {
                return res.send({
                    status: 200,
                    message: "Offers not found",
                    data: []
                })
            }

            res.send({
                status: 200,
                message: "Offers found",
                data: offersRes
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
    respondArtWorkOffer: async (req, res) => {
        try {
            const { id, offer_status } = req.body;
            console.log("req body", req.body)
            
            const acceptArtWorkOffer = await respondArtWorkOfferService(id, offer_status)
            const offerDetails = await getSpecificArtWorkOfferService(id);
            console.log("offerDetails", offerDetails[0].email)

            let transporter = nodeMailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: false,
                auth: { 
                    user:process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            });

            if(offer_status === "Accept"){
                
                let html = offerAccept(offerDetails[0].name,offerDetails[0].offer);
                mailOptions = { from: process.env.MAIL_USER, to: [offerDetails[0].email, "umar.maqsood06@gmail.com"], subject: "Offer Accepted", html: html };
                await transporter.sendMail(mailOptions);
            }
            if(offer_status === "Reject"){
                let html = offerReject(offerDetails[0].name,offerDetails[0].offer);
                mailOptions = { from: process.env.MAIL_USER, to: [offerDetails[0].email, "umar.maqsood06@gmail.com"], subject: "Offer Rejected", html: html };
                await transporter.sendMail(mailOptions);
            }

            res.send({
                status: 200,
                message: "Offer "+ offer_status,
            })
        }
        catch (e) {
            console.log(e.message)
            res.send({
                status: 500,
                message: "Please Try Again",
            })
        }
    },

}