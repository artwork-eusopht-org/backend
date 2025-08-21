const bycrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");

const { updateArtWorkSoldService } = require("../services/artworksService");
const { offerAccept, offerReject, offerRecieved } = require('./emailTemplate');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = {
    
    stripeWebhook: async (req, res) => {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = 'whsec_LPkaQcN6826uARpnlDBfW8wxzEGID8nU'; // Replace with your actual Stripe webhook secret

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err) {
            console.error('⚠️ Webhook signature verification failed.', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // ✅ Check if the payment was successful
            if (session.payment_status === 'paid') {
                const artworkId = session.metadata.artworkId;
                console.log("artworkId in webhook", artworkId);
                
                // Mark artwork as sold
                if (artworkId) {
                    // artworks[artworkId].status = 'sold';
                    await updateArtWorkSoldService(artworkId);
                    console.log(`✅ Artwork ${artworkId} marked as sold (payment confirmed).`);
                }
            } else {
                console.warn(`⚠️ Payment not completed for session: ${session.id}`);
            }
        }

        res.status(200).json({ received: true });
    }

};