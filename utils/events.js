const loginEventHandlers = [];
let logined = false;

function onLogin(callback) {
  if (logined) {
    callback();

    return;
  }

  loginEventHandlers.push(callback);
}

function emitLogin() {
  logined = true;

  loginEventHandlers.forEach(handler => {
    handler();
  });
}

export {
  onLogin,
  emitLogin,
};
