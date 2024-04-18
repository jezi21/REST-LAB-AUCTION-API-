import { createSignal, createResource } from "solid-js";
import { Portal } from "solid-js/web";

import addAuction from "./addAuction";
import auctions from "./auctions";
import { USERS_URL, AUCTIONS_URL, PAYMENTS_URL, get } from "../requests";

function Auctions({user}) {
  
  const [isActive, setIsActive] = createSignal(false);

  return (
    <div>
      <h1>My Auctions</h1>
    
      <button class="button is-primary" onClick={() => setIsActive(true)}>
        Add Auction
      </button>
      <Show when={!user.loading}>
        {auctions(user)}
      </Show>
      <Portal mount={document.body}>
        <div classList={{ modal: true, "is-active": isActive() }}>
          {addAuction({setIsActive})}
        </div>
      </Portal>
    </div>
  );
}

function WonAuctions({user}) {
  return (
    <div >
      <h1>My Won Auctions</h1>
      {auctions(user,"auctions/bids/me?only_won=true")}
    </div>
  );
}


function Payments() {
  const [payments] = createResource(() => get(`${PAYMENTS_URL}payments/me`));

  return (
    <div>
      <h1>My Payments</h1>
      <ul>
        <Show when={!payments.loading}>
          <For each={payments()}>{(payment) => <li>{payment.amount}</li>}</For>
        </Show>
      </ul>
    </div>
  );
}

function User({user}) {
  

  return (
    <div>
      <h1>My Profile</h1>

      <Show when={!user.loading}>
        <div class="columns">
          <div class="column">Name</div>
          <div class="column">{user().name}</div>
        </div>
        <div class="columns">
          <div class="column">Surname</div>
          <div class="column">{user().surname}</div>
        </div>
        <div class="columns">
          <div class="column">Email</div>
          <div class="column">{user().email}</div>
        </div>
      </Show>
    </div>
  );
}

export default function profile() {
  const [user] = createResource(() => get(`${USERS_URL}users/me`));
  return (
    <div class="container">
      <div class="section">
        {User({user})}
      </div>
      <div class="section ">
        {Auctions({user})}
      </div>
      <div class="section">
        {WonAuctions({user})}
      </div>
    </div>
  );
}
