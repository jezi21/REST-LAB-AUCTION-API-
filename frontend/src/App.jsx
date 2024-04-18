import { Show, createSignal, Match, Switch } from "solid-js";

import {isLoggedIn, } from "./utils";

import navbar from "./components/navbar";
import footer from "./components/footer";


import home from "./views/home";
import auctions from "./views/auctions";
import profile from "./views/profile";


function App() {
  const [state, setState] = createSignal("home");
  const [isLogged, setIsLogged] = createSignal(isLoggedIn());
  console.log(isLogged())

  return (
    <div>
      {navbar({setState, isLogged, setIsLogged})}
      <Switch>
        <Match when={state() === "home"}>{home()}</Match>
        <Match when={state() === "profile"}>{profile()}</Match>
        <Match when={state() === "auctions"}>{auctions()}</Match>
      </Switch>
      {footer()}
    </div>
  );
}







export default App;
