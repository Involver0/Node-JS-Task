const form = document.querySelector('form');

const API = 'http://localhost:8080';

const userLogin = async (payload) => {
  try {
    const response = await fetch(`${API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (err) {
    return console.error(err);
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    email: event.target.email.value,
    password: event.target.password.value,
  };

  const userData = await userLogin(payload);
  if (userData.token) {
    Cookies.set('token', userData.token, { expires: 0.1 });
    window.location.replace('./home.html');
  }
});
