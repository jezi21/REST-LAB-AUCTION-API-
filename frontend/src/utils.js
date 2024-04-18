import { login, register } from "./requests.js";

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function removeToken() {
  localStorage.removeItem("token");
}

function isLoggedIn() {
  const token = getToken();
  if (token=="undefined" || token==null) {
    return false;
  }
  return !!token;
}

function logoutUser() {
  removeToken();
}

function loginUser(username, password, setIsLogged) {
  console.log(username);
  console.log(password);
  return login(username, password).then((token) => {
    setToken(token);
    setIsLogged(true);
  });
}

function registerUser(name, surname, email, password, setIsLogged) {
  register(name, surname, email, password).then((data) => {
    let a = 1;
  });
  return loginUser(email, password, setIsLogged);
}

export { removeToken, isLoggedIn, loginUser, logoutUser, registerUser };
