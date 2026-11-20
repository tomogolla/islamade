<script lang="ts">
  import { site } from '#lib/data/config';
  import SocialIcon from '#lib/components/ui/SocialIcon.svelte';
</script>

<footer class="footer">
  <div class="footer-grid shell">
    <div class="footer-intro">
      <a class="wordmark" href="/">islamade</a>
      <p class="footer-copy">{site.description}</p>
      <p class="footer-copy">{site.whatsappDisplay}<br>{site.email}</p>
      <div class="social-row">
        <a class="instagram" href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon name="instagram" /></a>
        <a class="youtube" href={site.youtube} target="_blank" rel="noreferrer" aria-label="YouTube"><SocialIcon name="youtube" /></a>
        <a class="whatsapp" href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noreferrer" aria-label="WhatsApp"><SocialIcon name="whatsapp" /></a>
      </div>
    </div>
    <div><h2>Shop</h2><a href="/shop">All pieces</a><a href="/collections">Collections</a><a href="/custom">Custom orders</a></div>
    <div><h2>Studio</h2><a href="/about">Our story</a><a href={`mailto:${site.email}`}>Contact</a><a href="/about#care">Care guide</a></div>
    <div class="newsletter"><h2>Little notes from the studio</h2><p class="footer-copy">A newsletter is planned, but sign-up is not connected yet.</p><div class="newsletter-placeholder" aria-label="Newsletter coming soon">Newsletter sign-up coming soon</div></div>
  </div>
  <div class="legal shell"><span>© {new Date().getFullYear()} islamade</span><span>Made with yarn, care &amp; patience.</span></div>
</footer>

<style>
  .social-row a {
    margin: 0 !important;
    color: white !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .social-row a:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px #0d172333;
  }
  .social-row a:focus-visible {
    outline: 3px solid var(--yellow);
    outline-offset: 3px;
  }
  .social-row .instagram {
    background: radial-gradient(circle at 30% 105%, #ffd600 0 24%, #ff7a00 25% 39%, #ff0169 40% 60%, #d300c5 61% 77%, #7638fa 78% 100%);
  }
  .social-row .youtube { background: #ff0033; }
  .social-row .whatsapp { background: #25d366; }
</style>
