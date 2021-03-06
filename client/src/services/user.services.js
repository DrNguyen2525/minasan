const BASE_URL = process.env.REACT_APP_BASE_URL;

export const signInWithEmail = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (response.status === 200 || response.status === 201) {
      const { accessToken } = await response.json();
      localStorage.setItem('accessToken', accessToken);

      return await getCurrentUser(accessToken);
    }

    if (response.status >= 400) {
      const { message } = await response.json();

      alert(message);

      throw new Error(response.statusText);
    }

    return {};
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const getCurrentUser = async accessToken => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const {
      id,
      name: username,
      email,
      hobbies,
      topics,
      avatarUrl
    } = await response.json();

    return response.status === 200
      ? {
          user: {
            id,
            username,
            email,
            hobbies,
            topics,
            avatarUrl
          }
        }
      : {};
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const signUp = async (username, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: username, email, password })
    });

    if (response.status === 201) {
      const {
        id,
        name: newUsername,
        email: newUserEmail
      } = await response.json();

      alert(
        'Signed up successfully. You can use your credentials to sign in now.'
      );

      return { user: { id, username: newUsername, email: newUserEmail } };
    }

    if (response.status >= 400) {
      const { message } = await response.json();

      alert(message);

      throw new Error(response.statusText);
    }

    return {};
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export const fetchHobbies = async accessToken => {
  try {
    const response = await fetch(`${BASE_URL}/api/hobbies`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const hobbiesList = await response.json();
    return {
      hobbyList: hobbiesList.map(mes => {
        return { id: mes.id, name: mes.name };
      })
    };
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

export const fetchTopics = async accessToken => {
  const response = await fetch(`${BASE_URL}/api/topics`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const topicList = await response.json();
  return {
    topicList: topicList.map(mes => {
      return { id: mes.id, name: mes.name };
    })
  };
};

export const updateProfile = async (accessToken, userProfile) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userProfile)
    });

    const user = await response.json();

    const { name, avatarUrl, hobbies, topics } = user;

    return response.status === 200
      ? { user: { username: name, avatarUrl, hobbies, topics } }
      : {};
  } catch (error) {
    console.error(error.response);
    throw new Error(error.message);
  }
};

export const updateAvatar = async (accessToken, avatar) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/me`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: avatar
    });

    const user = await response.json();

    const { name, avatarUrl, hobbies, topics } = user;

    return response.status === 200
      ? { user: { username: name, avatarUrl, hobbies, topics } }
      : {};
  } catch (error) {
    console.error(error.response);
    throw new Error(error.message);
  }
};
