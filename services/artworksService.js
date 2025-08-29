const pool = require("../config/database");
const { insertAirtableRecord, getAirtableRecords, getAirtableRecordByExternalId, GetAllOffersService, uploadBase64AndInsert, UpdateOfferTableStatus } = require("../lib/airtable");


module.exports = {
    createArtworkService: (title, artist, year, medium, dimensions, image, description, price, offerStatus) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO artworks (title, artist, year, medium, dimensions, description, price, image, offerStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, artist, year, medium, dimensions, description, price, image, offerStatus],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }

                    // Insert Into Airtable as well
                    try {
                        const newId = results.insertId;
                        // Insert into Airtable as well
                        const airtableResp = await uploadBase64AndInsert(image, {
                            // "External ID": newId,   // keep MySQL ID reference
                            id: newId,
                            title: title,
                            artist: artist,
                            year: year,
                            medium: medium,
                            dimensions: dimensions,
                            description: description,
                            price: price,
                            image: image,
                            payment_status: "Unpaid",
                            sold: "No",
                            offerStatus: "None",
                            visitors: "0",
                            status: "1",
                            offerStatus: offerStatus
                        });

                        return resolve(results);
                    } catch (err) {
                        console.error("Airtable insert failed:", err.response?.data || err.message);
                        // You might choose to still resolve MySQL insert, or reject here
                        return reject(err);
                    }

                    // end here

                }
            );

        });
    },
    getArtworksService: () => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT a.*, COUNT(o.id) AS offer_count 
       FROM artworks a 
       LEFT JOIN offers o ON o.art_id = a.id 
       WHERE a.status = 1 
       GROUP BY a.id;`,
                [],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }

                    // Get Airtable records as well 

                    try {
                        // ✅ Fetch from Airtable as well
                        const airtableRecords = await getAirtableRecords(process.env.AIRTABLE_ARTWORK_TABLE, process.env.AIRTABLE_OFFER_TABLE);
                        return resolve(airtableRecords);
                    } catch (err) {
                        console.error("Error in getArtworksService:", err.message);
                        return reject(err);
                    }
                }
            );
        });
    },
    getSpecificArtworkService: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM artworks WHERE status = 1 AND id = ? `,
                [id],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    try {
                        // ✅ Fetch from Airtable as well
                        const airtableRecord = await getAirtableRecordByExternalId(process.env.AIRTABLE_ARTWORK_TABLE, id);
                        return resolve(airtableRecord);
                    } catch (err) {
                        console.error("Error in getArtworksService:", err.message);
                        return reject(err);
                    }
                    // return resolve(results);
                }
            );
        });
    },
    createArtworkOfferService: (name, email, phone, offer, notes, art_id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO offers (art_id, name, email, phone, offer, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [art_id, name, email, phone, offer, notes, 1],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    try {
                        const newId = results.insertId;
                        // Insert into Airtable as well
                        const airtableResp = await insertAirtableRecord(process.env.AIRTABLE_OFFER_TABLE, {
                            // "External ID": newId,   // keep MySQL ID reference
                            id: newId,
                            art_id: art_id,
                            name: name,
                            email: email,
                            phone: phone,
                            offer: offer,
                            notes: notes,
                            status: "1",
                        });

                        return resolve(results);
                    } catch (err) {
                        console.error("Airtable insert failed:", err.response?.data || err.message);
                        // You might choose to still resolve MySQL insert, or reject here
                        return reject(err);
                    }

                    // return resolve(results);
                }
            );
        });
    },
    fetchAllOffersService: () => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT a.*,o.offer,o.id as offer_id,o.name,o.email,o.phone,o.notes,o.created_at,o.offer_status FROM offers o join artworks a on a.id = o.art_id  order by o.id`,
                [],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }

                    try {
                        // ✅ Fetch from Airtable as well
                        const airtableRecords = await GetAllOffersService(process.env.AIRTABLE_OFFER_TABLE, process.env.AIRTABLE_ARTWORK_TABLE);
                        return resolve(airtableRecords);
                    } catch (err) {
                        console.error("Error in getArtworksService:", err.message);
                        return reject(err);
                    }
                }
            );
        });
    },
    respondArtWorkOfferService: (id, offer_status) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE offers set offer_status = ? where id = ?`,
                [offer_status, id],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    try {
                        // ✅ Fetch from Airtable as well
                        const airtableRecords = await UpdateOfferTableStatus(process.env.AIRTABLE_OFFER_TABLE, id, offer_status);
                        return resolve(airtableRecords);
                    } catch (err) {
                        console.error("Error in getArtworksService:", err.message);
                        return reject(err);
                    }
                    // return resolve(results);
                }
            );
        });
    },
    getSpecificArtWorkOfferService: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM offers where id = ?`,
                [id],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    try {
                        // ✅ Fetch from Airtable as well
                        const airtableRecord = await getAirtableRecordByExternalId(process.env.AIRTABLE_OFFER_TABLE, id);
                        return resolve(airtableRecord);
                    } catch (err) {
                        console.error("Error in getArtworksService:", err.message);
                        return reject(err);
                    }

                    // return resolve(results);
                }
            );
        });
    },
    updateArtWorkSoldService: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE artworks set sold = 'Yes', payment_status = 'Received' where id = ?`,
                [id],
                async (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    try {
                        // ✅ Sync update to Airtable as well
                        const airtableRecords = await UpdateArtworkSoldStatus(
                            process.env.AIRTABLE_ARTWORK_TABLE, // put your Artwork table ID here
                            id
                        );
                        return resolve(airtableRecords);
                    } catch (err) {
                        console.error("Error in updateArtWorkSoldService:", err.message);
                        return reject(err);
                    }

                    // return resolve(results);
                }
            );
        });
    },

}