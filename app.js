console.log('JS loaded');

const clientId = 'YOUR_API_KEY_HERE';
const clientSecret = 'YOUR_API_SECRET_HERE';

async function getAccessToken() {
  try {
    const response = await fetch('https://api.petfinder.com/v2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching token: ${data.error}`);
    }

    return data.access_token;
  } catch (error) {
    console.error('Failed to get access token:', error);
  }
}

async function getPitbulls() {
  const token = await getAccessToken();

  try {
    const response = await fetch(
      'https://api.petfinder.com/v2/animals?type=dog&breed=pit%20bull%20terrier&status=adoptable&limit=5',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();
    console.log('Pitbulls:', data.animals);
  } catch (error) {
    console.error('Error fetching pitbulls:', error);
  }
}

getPitbulls();

