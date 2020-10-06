const TOKEN_KEY = 'chat_app_token';
const host = 'localhost:3000';

$(document).ready(function() {
  checkAuth();
});

function setToken(token) {
  window.localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

function getToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

function removeToken() {
  clearAll();
  window.localStorage.removeItem(TOKEN_KEY);
  checkAuth();
}

function login() {
  let userName = $('#username').val();
  let password = $('#password').val();

  $.ajax({
    type: 'POST',
    url: `/auth/register-or-login`,
    data: {
      username: userName,
      password: password,
    },
    dataType: 'json',
    success: function(json) {
      setToken(json);
      checkAuth();
      socket.on('connect', () => {
        socket.emit('subscribe', getUser().user._id);
      });
      getFriends();
    },
    error: function(xhr, status, errorThrown) {
      alert(xhr.responseText);
    },
  });
}

function getUser() {
  let token = getToken();

  let user = JSON.parse(token);
  return user;
}
function checkAuth() {
  let token = getToken();

  if (token) {
    let user = JSON.parse(token);
    return $('#loginAlter').html(
      getLoginAlterHTML(true, { username: user.user.username }),
    );
  } else {
    return $('#loginAlter').html(getLoginAlterHTML(false));
  }
}

function getLoginAlterHTML(auth = false, user = {}) {
  if (!auth)
    return `<div class="col s6 ">
  <div class="row">
    <div class="input-field input-field inline">
      <input id="username" type="text" class="validate" />
      <label for="username">Username</label>
    </div>
    <div class="input-field inline">
      <input id="password" type="password" class="validate" />
      <label for="password">Password</label>
    </div>
    <button
      class="waves-effect waves-light btn inline"
      onclick="login()"
    >
      Proceed
    </button>
  </div>
</div>`;
  else {
    return ` <div>
                <h3 for="username">Logged in as ${user.username} </h3>
                <button
                    class="waves-effect waves-dark btn inline"
                    onclick="removeToken()">
                    Logout
                </button>
              </div>`;
  }
}
