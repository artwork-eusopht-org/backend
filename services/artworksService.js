const pool = require("../config/database");

module.exports = {
    createArtworkService: (title, artist, year, medium, dimensions, image, description, price, offerStatus) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO artworks (title, artist, year, medium, dimensions, description, price, image, offerStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [title, artist, year, medium, dimensions, description, price, image, offerStatus ],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getArtworksService: () => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT a.*, COUNT(o.id) AS offer_count FROM artworks a LEFT JOIN offers o ON o.art_id = a.id WHERE a.status = 1 GROUP BY a.id;`,
                [],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getSpecificArtworkService: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM artworks WHERE status = 1 AND id = ? `,
                [id],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    createArtworkOfferService: (name, email, phone, offer, notes, art_id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO offers (art_id, name, email, phone, offer, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [art_id, name, email, phone, offer, notes, 1 ],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    fetchAllOffersService: () => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT a.*,o.offer,o.id as offer_id,o.name,o.email,o.phone,o.notes,o.created_at,o.offer_status FROM offers o join artworks a on a.id = o.art_id  order by o.id`,
                [],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    respondArtWorkOfferService: (id, offer_status) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE offers set offer_status = ? where id = ?`,
                [offer_status, id],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    getSpecificArtWorkOfferService: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM offers where id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    updateArtWorkSoldService: (id) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE artworks set sold = 'Yes', payment_status = 'Received' where id = ?`,
                [id],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    },
    
}