console.log('JS loaded');

const clientId = 'wjLG4VXM5xc43wMsWsynrTTMUqdKORUsIKCsgueulhyvfquCLN';
const clientSecret = 'E7ILoZMFTSNamjiXRZJjJx0RyOqqKeBc4dTBN39g';

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

    const container = document.getElementById('dog-list');
    container.innerHTML = ''; 

    data.animals.forEach(dog => {
      const card = document.createElement('div');
      card.classList.add('dog-card');

      const imageUrl = dog.photos[0]?.medium || 'https://via.placeholder.com/300x200?text=No+Image';

      card.innerHTML = `
        <img src="${imageUrl}" alt="${dog.name}" />
        <h2>${dog.name}</h2>
        <p>${dog.breeds.primary}</p>
        <p>${dog.contact.city}, ${dog.contact.state}</p>
        <a href="${dog.url}" target="_blank">View Profile</a>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error fetching pitbulls:', error);
  }
}

getPitbulls();

document.getElementById('adopt-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  document.getElementById('form-message').textContent = isValidEmail
    ? '✅ Thanks! We’ll be in touch.'
    : '❌ Please enter a valid email address.';
});


