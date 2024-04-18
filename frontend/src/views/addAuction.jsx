import { post, AUCTIONS_URL } from "../requests";
import { createSignal } from "solid-js";
import categories from "../components/categories";

export default function addAuction({ setIsActive }) {
  const [title, setTitle] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [minimum_bid, setMinimumBid] = createSignal(0);
  const [imageUrl, setImageUrl] = createSignal("");
  const [start_date, setStartDate] = createSignal("");
  const [start_time, setStartTime] = createSignal("");
  const [end_date, setEndDate] = createSignal("");
  const [end_time, setEndTime] = createSignal("");


  const [category, setCategory] = createSignal("");

  const handleAddAuction = () => {
    const body = {
      title: title(),
      description: description(),
      minimum_bid: minimum_bid(),
      start_date: start_date() + "T" + start_time(),
      end_date: end_date() + "T" + end_time(),
      image_url: imageUrl(),
      category_id: category(),
    };
    post(`${AUCTIONS_URL}auctions`, body).then((data) => {
      setIsActive(false);
    });
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
            Add Auction
          </p>
          <button
            class="delete"
            onClick={() => setIsActive(false)}
            aria-label="close"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Title</label>
            <div class="control">
              <input
                class="input"
                type="text"
                value={title()}
                onInput={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Description</label>
            <div class="control">
              <input
                class="input"
                type="text"
                value={description()}
                onInput={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="field">
            <label class="label">Image URL</label>
            <div class="control">
              <input
                class="input"
                type="text"
                value={imageUrl()}
                onInput={(e) => {
                  setImageUrl(e.target.value);
                }}
              />
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Minimum Bid</label>
                <div class="control">
                  <input
                    class="input"
                    type="number"
                    value={minimum_bid()}
                    onInput={(e) => {
                      setMinimumBid(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="column">
         
              {categories(setCategory)}
            
              </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">Start Date</label>
                <div class="control">
                  <input
                    class="input"
                    type="date"
                    value={start_date()}
                    onInput={(e) => {
                      setStartDate(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">Start Time</label>
                <div class="control">
                  <input
                    class="input"
                    type="time"
                    value={start_time()}
                    onInput={(e) => {
                      setStartTime(e.target.value);
                      console.log(start_time());
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column">
              <div class="field">
                <label class="label">End Date</label>
                <div class="control">
                  <input
                    class="input"
                    type="date"
                    value={end_date()}
                    onInput={(e) => {
                      setEndDate(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            <div class="column">
              <div class="field">
                <label class="label">End Time</label>
                <div class="control">
                  <input
                    class="input"
                    type="time"
                    value={end_time()}
                    onInput={(e) => {
                      setEndTime(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="field is-grouped">
            <div class="control">
              <button onClick={handleAddAuction} class="button is-link">
                Add Auction
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
