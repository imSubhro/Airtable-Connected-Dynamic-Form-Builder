const axios = require('axios');

const getAirtableToken = async (code) => {
  const encodedCredentials = Buffer.from(
    `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    'https://airtable.com/oauth2/v1/token',
    new URLSearchParams({
      code,
      redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
      grant_type: 'authorization_code',
      code_verifier: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' // If using PKCE, otherwise remove or adjust
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
      },
    }
  );

  return response.data;
};

const refreshAirtableToken = async (refreshToken) => {
  const encodedCredentials = Buffer.from(
    `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    'https://airtable.com/oauth2/v1/token',
    new URLSearchParams({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${encodedCredentials}`,
      },
    }
  );

  return response.data;
};

const getBases = async (accessToken) => {
  const response = await axios.get('https://api.airtable.com/v0/meta/bases', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.bases;
};

const getTables = async (accessToken, baseId) => {
  const response = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data.tables;
};

const createRecord = async (accessToken, baseId, tableId, fields) => {
  const response = await axios.post(
    `https://api.airtable.com/v0/${baseId}/${tableId}`,
    { fields, typecast: true },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

module.exports = { getAirtableToken, refreshAirtableToken, getBases, getTables, createRecord };
