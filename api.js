const apiKey = 'f160e946-a508-4a3a-8cff-9be4336ee4ec';
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiVmljQiIsImVtYWlsIjoidmljYnJvMDI0NThAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MzkzODM0MjJ9.wx64An-JmnLU_HeQjjuSz1O2ey04DCpKGnHUhpXTTmQ';

const options = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'X-Noroff-API-Key': apiKey,
    'Content-Type': 'application/json'
  }
};

async function fetchPosts() {
  try {
    const response = await fetch('https://v2.api.noroff.dev/blog/posts/vicbro02458@stud.noroff.no', options);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}