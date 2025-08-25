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


async function updateAirtableImage(tableId, recordId, image) {
  const { data } = await airtable.patch(`${tableId}/${recordId}`, {
    fields: {
      image: [{ url: image }],
    },
  });
  return data;
}



// async function uploadBase64ToAirtable(baseId, recordId, fieldName, base64Data, mimeType, filename) {
//   const url = `https://content.airtable.com/v0/${baseId}/${recordId}/${fieldName}/uploadAttachment`;

//   const response = await axios.post(
//     url,
//     {
//       file: {
//         data: base64Data,
//         type: mimeType,
//         filename: filename,
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   return response.data; // contains attachment object with URL
// }

module.exports = { insertAirtableRecord, updateAirtableImage };
