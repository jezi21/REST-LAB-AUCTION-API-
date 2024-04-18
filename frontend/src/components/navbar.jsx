import loginOrSignup from "./login";

function navbar({ setState, isLogged, setIsLogged }) {
  return (
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item">
          <strong>Aukcjonarz</strong>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <a onClick={() => setState("home")} class="navbar-item">
            Home
          </a>
          <a onClick={() => setState("auctions")} class="navbar-item">
            Auctions
          </a>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            {loginOrSignup({ setState, isLogged, setIsLogged })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default navbar;
