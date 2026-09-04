import axios from 'axios';
import {
  authAsCredentialsState,
  clearAxiosAuth,
  LOCALSTORAGE_AUTH_KEY,
  setUpAxios,
} from '@/libs/auth';

function saveLocalDataAuth (store, apiId, apiToken) {
  const credentialsObj = {
    auth: {
      apiId,
      apiToken,
    },
  };

  const userLocalData = JSON.stringify(credentialsObj);

  localStorage.setItem(LOCALSTORAGE_AUTH_KEY, userLocalData);

  store.state.credentials = authAsCredentialsState(credentialsObj);
}

export function register () {
  window.location.href = 'https://habitica.com/register';
}

export async function login (store, params) {
  const apiId = String(params.username || '').trim();
  const apiToken = String(params.password || '').trim();
  const credentialsObj = { auth: { apiId, apiToken } };
  setUpAxios(credentialsObj);

  try {
    await axios.get('/api/v4/user', { params: { userFields: '_id' } });
    saveLocalDataAuth(store, apiId, apiToken);
  } catch (err) {
    clearAxiosAuth();
    throw err;
  }
}

export async function verifyUsername (store, params) {
  const url = '/api/v4/user/auth/verify-username';
  const result = await axios.post(url, {
    username: params.username,
  });

  return result.data.data;
}

export async function verifyDisplayName (store, params) {
  const url = '/api/v4/user/auth/verify-display-name';
  const result = await axios.post(url, {
    displayName: params.displayName,
  });

  return result.data.data;
}

export async function checkEmail (store, params) {
  const url = '/api/v4/user/auth/check-email';
  const result = await axios.post(url, {
    email: params.email,
  });

  return result.data.data;
}

export async function socialAuth (store, params) {
  const url = '/api/v4/user/auth/social';
  const result = await axios.post(url, {
    allowRegister: params.allowRegister,
    username: params.username,
    network: params.auth.network,
    authResponse: params.auth.authResponse,
  });

  if (!result.data) {
    return null;
  }

  const user = result.data.data;

  saveLocalDataAuth(store, user.id, user.apiToken);
  return user.id;
}

export async function appleAuth (store, params) {
  const url = '/api/v4/user/auth/apple';
  const result = await axios.get(url, {
    params: {
      allowRegister: params.allowRegister,
      code: params.code,
      id_token: params.idToken,
      name: params.name,
      username: params.username,
      email: params.email,
    },
  });

  if (!result.data) {
    return null;
  }

  if (result.data.message && result.data.id_token) {
    return {
      idToken: result.data.id_token,
      email: result.data.email,
    };
  }

  const user = result.data.data;

  saveLocalDataAuth(store, user.id, user.apiToken);
  return { id: user.id };
}

export function logout (store, options = {}) {
  localStorage.clear();
  sessionStorage.clear();
  clearAxiosAuth();
  const query = options.redirectToLogin === true ? '?redirectToLogin=true' : '';
  window.location.href = `/login${query}`;
}

export function setNewToken (store, params) {
  saveLocalDataAuth(store, params.userId, params.apiToken);
}
