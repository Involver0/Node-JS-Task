const form = document.querySelector('form');

const API_BASE = 'http://localhost:8080';

const createGroup = async (payload) => {
  try {
    const response = await fetch(`${API_BASE}/creategroup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Cookies.get('token')}`,
      },
      body: JSON.stringify(payload),
    });
    console.log(response);
    return await response.json();
  } catch (err) {
    return console.log(err);
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    name: event.target.name.value,
  };

  const userData = await createGroup(payload);

  if (userData.error) {
    window.location.replace('./login.html');
  }
});
