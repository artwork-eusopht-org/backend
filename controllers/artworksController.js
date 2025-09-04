const bycrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");

const { createArtworkService, getArtworksService, getSpecificArtworkService, createArtworkOfferService, fetchAllOffersService, respondArtWorkOfferService, getSpecificArtWorkOfferService } = require("../services/artworksService");
const { offerAccept, offerReject, offerRecieved } = require('./emailTemplate');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
    createArtwork: async (req, res) => {
        try {
            const { title, artist, year, medium, dimensions, description, minPrice, offerStatus, image } = req.body;
            console.log("req body", req.body)
            // const firstFileName = req.files[0].filename;
            // console.log("imageName", firstFileName); 
            
            const createArtWork = await createArtworkService(title, artist, year, medium, dimensions, image, description, minPrice, offerStatus)
            // console.log("createArtWork", createArtWork)
            // console.log("req files", req.files)

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
            mailOptions = { from: process.env.MAIL_USER, to: [process.env.MAIL_USER], subject: "Offer Received", html: html }; // NEW CODE
            // OLD CODE   mailOptions = { from: process.env.MAIL_USER, to: [process.env.MAIL_USER,"umar.maqsood06@gmail.com"], subject: "Offer Received", html: html };
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
            const artworkRes = await getSpecificArtworkService(offerDetails[0].art_id)
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
                
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    line_items: [
                        {
                            price_data: {
                                currency: 'aud',
                                unit_amount: offerDetails[0].offer * 100, // convert to cents
                                product_data: {
                                    name: artworkRes[0].title,
                                    description: `Purchase of artwork: ${artworkRes[0].title}`,
                                },
                            },
                            quantity: 1,
                        },
                    ],
                    success_url: `${process.env.CLIENT_URL}/payment-success`,
                    cancel_url: `${process.env.CLIENT_URL}/payment-cancelled`,
                    metadata: {
                        artworkId: artworkRes[0].id,
                    },
                });
                let firstName = offerDetails[0].name.split(" ")[0];
                let html = offerAccept(firstName,offerDetails[0].offer,session.url, artworkRes[0].title);
                mailOptions = { from: process.env.MAIL_USER, to: [offerDetails[0].email, "umar.maqsood06@gmail.com"], subject: `Offer Accepted – Complete Your Purchase of ${artworkRes[0].title}`, html: html };
                await transporter.sendMail(mailOptions);
            }
            if(offer_status === "Reject"){
                let firstName = offerDetails[0].name.split(" ")[0];
                let html = offerReject(firstName,offerDetails[0].offer, artworkRes[0].title);
                mailOptions = { from: process.env.MAIL_USER, to: [offerDetails[0].email,"umar.maqsood06@gmail.com"], subject: "Offer Response – A revised offer is Welcomed", html: html };
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
