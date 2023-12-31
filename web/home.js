const API_BASE = 'http://localhost:8080';

const form = document.querySelector('form');

document.addEventListener('DOMContentLoaded', async () => {
  console.log(document.cookie);
  if (document.cookie === '' || !document.cookie.includes('token')) {
    window.location.replace('./login.html');
  }

  const feed = document.getElementById('output');

  const getGroups = async () => {
    try {
      const response = await fetch(`${API_BASE}/home`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });
      return await response.json();
    } catch (err) {
      return console.log(err);
    }
  };

  const renderGroups = async (groups) => {
    groups.forEach((group) => {
      console.log(group);
      const card = document.createElement('div');
      const id = document.createElement('h4');
      const name = document.createElement('p');

      card.classList.add('group');
      id.textContent = `ID: ${group.id}`;
      name.textContent = group.name;

      card.append(id, name);
      feed.appendChild(card);
    });
  };

  const allGroups = await getGroups();

  console.log(allGroups);
  renderGroups(allGroups);

  if (allGroups.error) {
    window.location.replace('./login.html');
  }
});
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
