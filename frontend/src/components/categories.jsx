import { createResource } from "solid-js";
import { AUCTIONS_URL, get } from "../requests";
import { For, Show } from "solid-js/web";

export default function categories(setCategory) {
  const [categories] = createResource(() => get(`${AUCTIONS_URL}categories`));

  return (
    <div class="field">
      <label class="label">Category</label>
      <div class="control">
        <div class="select">
          <select
            value={setCategory()}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value={""} >Select category</option>
            <Show when={!categories.loading}>
              <For each={categories()["categories"]}>
                {(category) => (
                  <option value={category.id}>{category.name}</option>
                )}
              </For>
            </Show>
          </select>
        </div>
      </div>
    </div>
  );
}
