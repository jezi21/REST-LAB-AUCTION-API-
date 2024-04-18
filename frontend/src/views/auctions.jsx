import { createSignal, createResource, createEffect } from "solid-js";
import { For, Show, Portal } from "solid-js/web";
import { AUCTIONS_URL, PAYMENTS_URL, get, del, post } from "../requests";
import categories from "../components/categories";

function bidModal({ auction, setIsActive }) {
  const [bid, setBid] = createSignal(0);
  const handleBid = () => {
    const body = {
      amount: bid(),
    };
    post(`${AUCTIONS_URL}auctions/${auction.id}/bid`, body).then((data) => {
      setIsActive(false);
    });
  };

  return (
    <div class="modal-background">
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Bid</p>
          <button
            class="delete"
            onClick={() => setIsActive(false)}
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Amount</label>
            <div class="control">
              <input
                class="input"
                type="number"
                value={bid()}
                onInput={(e) => setBid(e.target.value)}
              />
            </div>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" onClick={handleBid}>
            Bid
          </button>
          <button class="button" onClick={() => setIsActive(false)}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}

function auctionCard({ auction, user }) {
  const [isActive, setIsActive] = createSignal(false);
  const [checkout, setCheckout] = createSignal("");

  const handleBid = () => {
    setIsActive(true);
  };

  const closedAndWon = () => {
    const currentDate = new Date();
    const endDate = new Date(auction.end_date);

    return (
      user && currentDate > endDate && auction.current_bider_id === user.id
    );
  };
  const open = () => {
    const currentDate = new Date();
    const startDate = new Date(auction.start_date);
    const endDate = new Date(auction.end_date);
    return currentDate > startDate && currentDate < endDate;
  };

  const owner = () => user && user.id == auction.user_id;

  const handlePay = () => {
    // if return redirect response open in new tab
    post(`${PAYMENTS_URL}payments/${auction.id}`).then((data) => {
      setCheckout(data.checkout_session_url);
    }
    );
  };

  const handleDelete = () => {
    del(`${AUCTIONS_URL}auctions/${auction.id}`).then((data) => {
      console.log(data);
    });
  };

  return (
    <div class="column is-3">
      <Portal mount={document.body}>
        <div classList={{ modal: true, "is-active": isActive() }}>
          {bidModal({ auction, setIsActive })}
        </div>
      </Portal>
      <div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img src={auction.image_url} alt="Placeholder image" />
          </figure>
        </div>
        <div class="card-content">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{auction.title}</p>
              <p class="subtitle is-6">{auction.description}</p>
            </div>
          </div>
          <div class="content">
            Current bid: {auction.current_bid}
            <br />
            Start Date: {auction.start_date}
            <br />
            End Date: {auction.end_date}
            <br />
            Minimum Bid: {auction.minimum_bid}
            <br />
            <Show when={open() && !owner()}>
              <button class="button is-primary" onClick={handleBid}>
                Bid
              </button>
            </Show>
            <Show when={owner()}>
              <button onClick={handleDelete} class="button is-danger">
                Delete
              </button>
            </Show>
            <Show when={closedAndWon()}>
              <button onClick={handlePay} class="button is-success">
                Pay
              </button>
            </Show>
            <Show when={checkout() !== ""}>
              <button onClick={() => window.open(checkout())} class="button is-success">
                go to payment
              </button>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function auctions(user, query = null) {
  const [category, setCategory] = createSignal("");

  const fetchAuctions = () => {
    if (query) {
      return get(`${AUCTIONS_URL}${query}`);
    }
    let url = `${AUCTIONS_URL}auctions?`;
    if (category() !== "") {
      url += `category_id=${category()}&`;
    }
    if (user) {
      url += `from_user=${user().id}&`;
    }
    return get(url);
  };

  // change auctions when category change
  const [auctions, { refetch }] = createResource(fetchAuctions);

  createEffect(() => {
    console.log(category());
    refetch();
  });

  return (
    <div class="section">
      {categories(setCategory)}
      <h1 class="notification">Auctions</h1>
      <div class="columns is-multiline is-mobile">
        <Show when={!auctions.loading}>
          <For each={auctions()["auctions"]}>
            {(auction) => auctionCard({ auction, user })}
          </For>
        </Show>
      </div>
    </div>
  );
}
