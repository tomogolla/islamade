<script lang="ts">
  import { page } from "$app/state";
  import Seo from "#lib/components/ui/Seo.svelte";
  import { visibleCollections } from "#lib/data/catalog";
  import { site } from "#lib/data/config";
  import { whatsappUrl } from "#lib/utils/whatsapp";
  let name = "",
    idea = "",
    inspired = page.url.searchParams.get("inspired") ?? "",
    colors = "",
    size = "",
    deadline = "",
    reference = "",
    status = "";
  let errors: { name?: string; idea?: string; reference?: string } = {};
  function validate() {
    errors = {};
    if (!name.trim()) errors.name = "Please add your name.";
    if (!idea.trim()) errors.idea = "Tell us what you would like.";
    if (reference && !/^https?:\/\//i.test(reference))
      errors.reference = "Use a full link beginning with http:// or https://.";
    return !Object.keys(errors).length;
  }
  function message() {
    return [
      `Hi islamade! I'd love to request a custom crochet piece 🧶`,
      "",
      `Name: ${name.trim()}`,
      `What I'd like: ${idea.trim()}`,
      `Inspired by collection: ${visibleCollections.find((c) => c.id === inspired)?.name || "not sure yet"}`,
      `Colors: ${colors.trim() || "open to ideas"}`,
      `Size: ${size.trim() || "not sure yet"}`,
      `Deadline: ${deadline || "no rush"}`,
      `Reference image: ${reference.trim() || "none"}`,
    ].join("\n");
  }
  function submit() {
    if (!validate()) {
      status = "Please check the highlighted fields.";
      return;
    }
    location.href = whatsappUrl(message());
  }
  function email() {
    if (!validate()) {
      status = "Please check the highlighted fields.";
      return;
    }
    location.href = `mailto:${site.email}?subject=${encodeURIComponent("Custom crochet request")}&body=${encodeURIComponent(message())}`;
  }
</script>

<Seo
  title="Custom crochet orders · islamade"
  description="Request a one-of-a-kind crochet piece from Islamade in your colors, size and style."
/>
<header class="page-hero shell">
  <p class="eyebrow">Made with you</p>
  <h1 class="title">Let’s make something one of one.</h1>
  <p class="lede">
    A favorite color, a gift with a story, or an idea you cannot stop thinking
    about—we will shape it together.
  </p>
</header>
<section class="section shell">
  <ol class="steps">
    <li class="step accent-pink">
      <span class="step-number">1</span>
      <h2>Share your idea</h2>
      <p>Tell us what you would like, your colors, size and any references.</p>
    </li>
    <li class="step accent-lavender">
      <span class="step-number">2</span>
      <h2>Plan it together</h2>
      <p>We will talk through yarn, details, pricing and timing.</p>
    </li>
    <li class="step accent-butter">
      <span class="step-number">3</span>
      <h2>Made by hand</h2>
      <p>Your piece comes to life, stitch by stitch.</p>
    </li>
  </ol>
</section>
<section class="section request-section">
  <div class="shell form-shell">
    <div>
      <p class="eyebrow">Start a request</p>
      <h2 class="title">Tell us what you’re dreaming of.</h2>
      <p class="lede">
        Submitting opens WhatsApp with your details ready to send. Nothing is
        stored on this website.
      </p>
    </div>
    <form on:submit|preventDefault={submit} novalidate>
      <div class="form-grid">
        <div class="field">
          <label for="name">Your name <small>Required</small></label><input
            id="name"
            bind:value={name}
            aria-invalid={Boolean(errors.name)}
          />{#if errors.name}<p class="error">{errors.name}</p>{/if}
        </div>
        <div class="field">
          <label for="inspired">Inspired by collection<small>Optional</small></label><select
            id="inspired"
            bind:value={inspired}
            ><option value="">Not sure yet</option
            >{#each visibleCollections as item}<option value={item.id}
                >{item.name}</option
              >{/each}</select
          >
        </div>
        <div class="field wide">
          <label for="idea">What would you like? <small>Required</small></label
          ><textarea
            id="idea"
            bind:value={idea}
            aria-invalid={Boolean(errors.idea)}></textarea>{#if errors.idea}<p
              class="error"
            >
              {errors.idea}
            </p>{/if}
        </div>
        <div class="field">
          <label for="colors"
            >Colors <small>For example: sage and cream</small></label
          ><input id="colors" bind:value={colors} />
        </div>
        <div class="field">
          <label for="size">Size <small>Approximate is fine</small></label
          ><input id="size" bind:value={size} />
        </div>
        <div class="field">
          <label for="deadline">Deadline</label><input
            id="deadline"
            type="date"
            bind:value={deadline}
            min={new Date().toISOString().slice(0, 10)}
          />
        </div>
        <div class="field">
          <label for="reference">Reference image link</label><input
            id="reference"
            type="url"
            bind:value={reference}
            placeholder="https://"
            aria-invalid={Boolean(errors.reference)}
          />{#if errors.reference}<p class="error">{errors.reference}</p>{/if}
        </div>
      </div>
      <div class="form-actions">
        <button class="button" type="submit">Send via WhatsApp</button><button
          class="button secondary"
          type="button"
          on:click={email}>Send by email</button
        >
      </div>
      <p role="status" aria-live="polite">{status}</p>
    </form>
  </div>
</section>

<style>
  .request-section {
    background: #fff;
  }
  .form-shell {
    display: grid;
    grid-template-columns: 0.75fr 1.25fr;
    gap: 4rem;
  }
  .step h2 {
    font-size: 1.4rem;
  }
  .step p {
    margin-top: 0.7rem;
  }
  @media (max-width: 800px) {
    .form-shell {
      grid-template-columns: 1fr;
    }
  }
</style>
