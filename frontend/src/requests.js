

const AUCTIONS_URL = 'http://localhost:8001/'
const PAYMENTS_URL = 'http://localhost:8002/'
const USERS_URL = 'http://localhost:8003/'

function getToken() {
  return localStorage.getItem('token')
}

function createHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (getToken()) {
    headers['Authorization'] = `Bearer ${getToken()}`;
  }

  return headers;
}

async function get(url) {
  const headers = createHeaders();

  console.log(url)

  return fetch(url, {
    method: 'GET',
    headers,
  }).then(
    response => {
      console.log(response)
      return response.json()
    }
  );
}

function post(url, data) {
  const headers = createHeaders();
  const req = {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  };
  


  return fetch(url, req).then(response => response.json());
}

function put(url, data) {
  const headers = createHeaders();

  return fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  }).then(response => response.json());
}

function del(url) {
  const headers = createHeaders();

  return fetch(url, {
    method: 'DELETE',
    headers,
  }).then(response => response.json());
}

function register(name,surname,email, password) {
  return post(`${USERS_URL}users`, { name,surname,email, password })
}


const login = async (username, password) => {
  const url = `${USERS_URL}token`; // Replace this with your actual API endpoint

  // Data to be sent in the request body
  const formData = new URLSearchParams();
  formData.append('grant_type', '');
  formData.append('username', username);
  formData.append('password', password);
  formData.append('scope', '');
  formData.append('client_id', '');
  formData.append('client_secret', '');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to login');
    }

    const tokenData = await response.json();
    const token = tokenData.access_token; // Assuming your API returns the token in a field named 'access_token'

    // Do something with the token, like storing it in localStorage or using it in subsequent requests
    console.log('Token:', token);

    return token; // Return the token if you need to use it elsewhere in your code
  } catch (error) {
    console.error('Error:', error.message);
  }
};


export {login,register,post,AUCTIONS_URL,USERS_URL,PAYMENTS_URL,getToken,get,put,del}