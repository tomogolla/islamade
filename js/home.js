/* Home page: puts a real collection photo in the tall "collections" tile.
   Uses the featured collection's cover; if that collection is empty or has
   no photo, uses the first collection that has products and a photo.
   If nothing loads, the placeholder picture in index.html stays. */

(function () {
  const photo = document.getElementById("home-collections-photo");
  if (!photo) return;

  const tile = photo.closest("a");

  loadCatalog()
    .then((catalog) => {
      const visible = catalog.visibleCollections;
      const pick = visible.find((c) => c.featured && c.cover) || visible.find((c) => c.cover);
      if (!pick) return;

      // The tile shows one real collection, so take visitors to that
      // collection rather than making them find it again in the full list.
      if (tile) {
        tile.href = pageURL("collection.html", `?c=${encodeURIComponent(pick.id)}`);
        tile.setAttribute("aria-label", `View the ${pick.name} collection`);
      }

      const placeholder = photo.src;
      photo.onerror = () => {
        photo.onerror = null;
        photo.src = placeholder;
      };
      photo.src = assetURL(pick.cover);
    })
    .catch((error) => console.warn("[islamade] Couldn't load the collections photo.", error));
})();
