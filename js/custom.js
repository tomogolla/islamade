/* Custom crochet page: request form.
   On submit, all the details are put into a WhatsApp message (or an email,
   if no WhatsApp number is set in js/config.js). Nothing is stored online. */

(function () {
  const form = document.getElementById("custom-form");
  const select = document.getElementById("inspired");
  const status = document.getElementById("form-status");
  const emailButton = document.getElementById("send-email");
  const deadline = document.getElementById("deadline");

  // Deadlines can't be in the past
  deadline.min = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

  // Fill the "inspired by collection" dropdown from data/collections.json
  // (only collections that have products)
  loadCatalog()
    .then((catalog) => {
      const options = catalog.visibleCollections
        .map((c) => `<option value="${escapeHTML(c.name)}" data-id="${escapeHTML(c.id)}">${escapeHTML(c.name)}</option>`)
        .join("");
      select.insertAdjacentHTML("beforeend", options);

      // Pre-select a collection when arriving from a collection page (?inspired=<id>)
      const inspired = getParam("inspired");
      const match = inspired && select.querySelector(`option[data-id="${CSS.escape(inspired)}"]`);
      if (match) match.selected = true;
    })
    .catch((error) => console.warn("[islamade] Couldn't load collections for the dropdown.", error));

  /* Collects the form into a tidy message */
  function buildMessage() {
    const value = (name) => form.elements[name].value.trim();
    const lines = [
      "Hi islamade! I'd love to request a custom crochet piece 🧶",
      "",
      `Name: ${value("name")}`,
      `What I'd like: ${value("idea")}`,
      `Inspired by collection: ${value("inspired") || "not sure yet"}`,
      `Colors: ${value("colors") || "open to ideas"}`,
      `Size: ${value("size") || "not sure yet"}`,
      `Deadline: ${value("deadline") || "no rush"}`,
      `Reference image: ${value("reference") || "none"}`,
    ];
    return lines.join("\n");
  }

  /* Uses the browser's built-in checks; marks invalid fields for screen readers */
  function checkForm() {
    let firstInvalid = null;
    Array.from(form.elements).forEach((field) => {
      if (!field.willValidate) return;
      const valid = field.checkValidity();
      field.setAttribute("aria-invalid", String(!valid));
      if (!valid && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      status.textContent = "Please fill in your name and what you'd like (and check the link, if you added one).";
      firstInvalid.focus();
      return false;
    }
    return true;
  }

  function sendByEmail() {
    window.location.href = mailtoLink("Custom crochet request", buildMessage());
    status.textContent = "Opening your email app… if nothing happens, email us at " + SITE.email;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!checkForm()) return;

    if (!SITE.whatsappNumber) {
      sendByEmail();
      return;
    }

    const url = whatsappLink(buildMessage());
    const opened = window.open(url, "_blank");
    if (opened) opened.opener = null;
    else window.location.href = url; // pop-up blocked: open in this tab instead
    status.textContent = "Opening WhatsApp with your request… just press send! Prefer email? Use the button below.";
  });

  emailButton.addEventListener("click", () => {
    if (checkForm()) sendByEmail();
  });

  // Clear the error styling as soon as a field is fixed
  form.addEventListener("input", (event) => {
    if (event.target.getAttribute("aria-invalid") === "true" && event.target.checkValidity()) {
      event.target.setAttribute("aria-invalid", "false");
    }
  });
})();
