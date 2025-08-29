const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

//Airtabel Setup By Developer
const airtable = axios.create({
  baseURL: `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/`,
  headers: {
    Authorization: `Bearer ${process.env.AIRTABLE_PAT}`,
    "Content-Type": "application/json",
  },
});
// Insert a new record into Airtable 
async function insertAirtableRecord(tableId, fields) {
  const { data } = await airtable.post(tableId, { records: [{ fields }] });
  return data;
}
// upload base64 image to IMGBB and insert record into Airtable
async function uploadBase64AndInsert(imageBase64, otherFields) {
  try {
    // ⚡ Strip prefix if exists (like "data:image/png;base64,")
    const cleanedBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Upload base64 to ImgBB
    const form = new FormData();
    form.append("image", cleanedBase64);

    const uploadResp = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const imageUrl = uploadResp.data.data.url;
    console.log("✅ Uploaded image to ImgBB:", imageUrl);

    // Insert into Airtable
    return await insertAirtableRecord(process.env.AIRTABLE_ARTWORK_TABLE, {
      ...otherFields,
      image: [{ url: imageUrl }],
    });
  } catch (err) {
    console.error("❌ Upload & Insert failed:", err.response?.data || err.message);
    throw err;
  }
}
// Fetch artworks with offer counts
async function getAirtableRecords(artworksTableId, offersTableId) {
  try {
    // 1. Fetch artworks
    const { data: artworksResp } = await airtable.get(artworksTableId, {
      params: {
        filterByFormula: "status = 1",
      },
    });

    const artworks = artworksResp.records.map(record => ({
      airtableId: record.id,
      ...record.fields,
    }));

    // 2. Fetch offers
    const { data: offersResp } = await airtable.get(offersTableId);
    const offers = offersResp.records.map(record => ({
      airtableId: record.id,
      ...record.fields,
    }));

    // 3. Count offers per artwork
    const offerCounts = offers.reduce((acc, offer) => {
      const artId = offer.art_id; // or offer.artwork[0] if it’s a linked record
      if (!acc[artId]) acc[artId] = 0;
      acc[artId]++;
      return acc;
    }, {});


    // 4. Merge counts into artworks
    const artworksWithOffers = artworks.map(artwork => ({
      ...artwork,
      offer_count: offerCounts[artwork.id] || 0, // use Airtable's "id" field
    }));

    return artworksWithOffers;
  } catch (err) {
    console.error("Error fetching from Airtable:", err.response?.data || err.message);
    throw err;
  }
}
// fetch a record by external ID (mysql id)
async function getAirtableRecordByExternalId(tableId, externalId) {
  try {
    const { data } = await airtable.get(tableId, {
      params: {
        filterByFormula: `{id} = '${externalId}'`, // match against your MySQL ID field
        maxRecords: 1
      },
    });

    if (data.records.length === 0) {
      return null; // no match found
    }

    const record = data.records[0];

    return [{
      airtableId: record.id,
      ...record.fields
    }];
  } catch (err) {
    console.error("Error fetching record by external ID:", err.response?.data || err.message);
    throw err;
  }
}
// Fetch all offers and merge with artwork details
async function GetAllOffersService(offersTableId, artworksTableId) {
  // fetch all artworks once
  const artResp = await airtable.get(artworksTableId, {
    params: { maxRecords: 200 }, // adjust if needed
  });

  // fetch all offers
  const offerResp = await airtable.get(offersTableId, {
    params: { maxRecords: 200, sort: [{ field: "id", direction: "asc" }] },
  });

  const offers = offerResp.data.records.map(o => {
    // extract offer fields
    const offer = {
      offer_id: o.fields.id,
      art_id: o.fields.art_id,
      offer: o.fields.offer,
      name: o.fields.name,
      email: o.fields.email,
      phone: o.fields.phone,
      notes: o.fields.notes,
      created_at: o.fields.created_at,
      offer_status: o.fields.offer_status,
    };

    // find matching artwork
    const artwork = artResp.data.records.find(
      a => String(a.fields.id) === String(o.fields.art_id)
    );

    // merge artwork fields + offer fields
    return artwork ? { ...artwork.fields, ...offer } : offer;
  });

  return offers;
}
// update image field of a record
async function updateAirtableImage(tableId, recordId, image) {
  const { data } = await airtable.patch(`${tableId}/${recordId}`, {
    fields: {
      image: [{ url: image }],
    },
  });
  return data;
}
// update offer_status of an offer by external ID (Mysql id)
async function UpdateOfferTableStatus(tableId, externalId, offer_status) {
  try {
    // 1. Find the record in Airtable by MySQL ID (externalId)
    const { data } = await airtable.get(tableId, {
      params: {
        filterByFormula: `{id} = '${externalId}'`, // assuming "id" field stores your MySQL offer ID
        maxRecords: 1,
      },
    });

    if (!data.records.length) {
      throw new Error(`Offer with id=${externalId} not found in Airtable`);
    }

    const airtableId = data.records[0].id;

    // 2. Update the offer_status field
    const resp = await airtable.patch(`${tableId}/${airtableId}`, {
      fields: {
        offer_status,
      },
    });

    return resp.data;
  } catch (err) {
    console.error("Error updating offer in Airtable:", err.response?.data || err.message);
    throw err;
  }
}
// update artwork's sold and payment_status by external ID (mysql id)
async function UpdateArtworkSoldStatus(tableId, externalId) {
  try {
    // 1. Find the artwork record in Airtable by MySQL ID
    const { data } = await airtable.get(tableId, {
      params: {
        filterByFormula: `{id} = '${externalId}'`, // "id" must be in Airtable schema
        maxRecords: 1,
      },
    });

    if (!data.records.length) {
      throw new Error(`Artwork with id=${externalId} not found in Airtable`);
    }

    const airtableId = data.records[0].id;

    // 2. Update the fields in Airtable
    const resp = await airtable.patch(`${tableId}/${airtableId}`, {
      fields: {
        sold: "Yes",
        payment_status: "Received",
      },
    });

    return resp.data;
  } catch (err) {
    console.error("Error updating artwork in Airtable:", err.response?.data || err.message);
    throw err;
  }
}
module.exports = { insertAirtableRecord, updateAirtableImage, getAirtableRecords, getAirtableRecordByExternalId, GetAllOffersService, uploadBase64AndInsert, UpdateOfferTableStatus, UpdateArtworkSoldStatus };
