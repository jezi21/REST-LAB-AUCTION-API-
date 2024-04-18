import { Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import { loginUser, logoutUser, registerUser } from "../utils";

function loginModal({ setIsLogged, setWhich }) {
  const [username, setUsername] = createSignal("user");
  const [password, setPassword] = createSignal("pass");

  const handleLogin = () => {
    loginUser(username(), password(), setIsLogged);
  };

  return (
    <div>
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Log in</p>
          <button
            class="delete"
            onClick={() => setWhich("")}
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Username</label>
            <div class="control">
              <input
                class="input"
                type="text"
                value={username()}
                onInput={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input
                class="input"
                type="password"
                value={password()}
                onInput={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button onClick={handleLogin} class="button is-link">
                Log in
              </button>
            </div>
            <div class="control">
              <button
                onClick={() => setWhich("")}
                class="button is-link is-light"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function signupModal({ setIsLogged, setWhich }) {
  const [name, setName] = createSignal("");
  const [surname, setSurname] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSignup = () => {
    registerUser(name(), surname(), email(), password(), setIsLogged);
    setWhich("");
  };

  return (
    <div>
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p
            class="modal-card
            -title"
          >
            Sign up
          </p>
          <button
            onClick={() => setWhich("")}
            class="delete"
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input
                class="input"
                type="text"
                value={name()}
                onInput={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Surname</label>
            <div class="control">
              <input
                class="input"
                type="text"
                value={surname()}
                onInput={(e) => setSurname(e.target.value)}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Email</label>
            <div class="control">
              <input
                class="input"
                type="email"
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input
                class="input"
                type="password"
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button onClick={handleSignup} class="button is-link">
                Sign up
              </button>
            </div>
            <div class="control">
              <button
                onClick={() => setWhich("")}
                class="button is-link is-light"
              >
                Cancel
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function loginOrSignup({ setState, isLogged, setIsLogged }) {
  const [which, setWhich] = createSignal("");
  const handleLogout = () => {
    logoutUser();
    setIsLogged(false);
  };

  return (
    <div>
      <div class="buttons">
        <Show when={isLogged()}>
          <button onClick={() => setState("profile")} class="button is-primary">
            <strong>Profile</strong>
          </button>
          <button onClick={handleLogout} class="button is-light">
            Log out
          </button>
        </Show>
        <Show when={!isLogged()}>
          <button onClick={() => setWhich("signup")} class="button is-primary">
            <strong>Sign up</strong>
          </button>
          <button onClick={() => setWhich("login")} class="button is-light">
            Log in
          </button>
        </Show>
      </div>
      <Portal mount={document.body}>
        <div class={`modal ${which() == "login" ? "is-active" : undefined}`}>
          {loginModal({ setIsLogged, setWhich })}
        </div>
        <div class={`modal ${which() == "signup" ? "is-active" : undefined}`}>
          {signupModal({ setIsLogged, setWhich })}
        </div>
      </Portal>
    </div>
  );
}

export default loginOrSignup;
