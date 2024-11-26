const tryLogin = (email, password, success, fail, saveToken = true) => {
  const users = JSON.parse(localStorage.getItem('users')) || [];

  const user = users.find((user) => user.id === email && user.password === password);

  if (user) {
    if (saveToken) {
      localStorage.setItem('TMDb-Key', user.password);
    }
    success(user);
  } else {
    fail();
  }
};

const tryRegister = (email, password, success, fail) => {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((existingUser) => existingUser.id === email);

    if (userExists) {
      throw new Error('User already exists');
    }

    const newUser = { id: email, password: password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    success();
  } catch (err) {
    fail(err);
  }
};

export { tryLogin, tryRegister };
