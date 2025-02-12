// API Configuration
const apiURL = 'https://v2.api.noroff.dev'; // Base API URL
const apiKey = '005c6cb6-ecde-4292-bd61-e6cea308e627'; // Your API Key
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmljQiIsImVtYWlsIjoidmljYnJvMDI0NThAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzkzMDYyMDV9.do_r_gfOnK_21KipYndjC_QtQhlmnk8hUzTjCk33dj8';

const options = {
  method: 'GET', // or 'POST', 'PUT', etc.
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Noroff-API-Key': apiKey,
    'Content-Type': 'application/json' // Include this if sending a body
  }
};