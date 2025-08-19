const pool = require("../config/database");

module.exports = {
    createUser: (full_name, email, password) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
                [full_name, email, password],
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
    getUserByEmail: (email) => {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM users WHERE email = ?`,
                [email],
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }
                    return resolve(results);
                }
            );
        });
    }
}