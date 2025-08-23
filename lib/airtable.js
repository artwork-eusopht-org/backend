const axios = require("axios");
require("dotenv").config();

const airtable = axios.create({
  baseURL: `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/`,
  headers: {
    Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
    "Content-Type": "application/json",
  },
});

async function insertAirtableRecord(tableId, fields) {
  const { data } = await airtable.post(tableId, { records: [{ fields }] });
  return data;
}

module.exports = { insertAirtableRecord };
