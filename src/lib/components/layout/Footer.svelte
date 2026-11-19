<script lang="ts">import { site } from '#lib/data/config';</script>
<footer class="footer">
  <div class="footer-grid shell">
    <div class="footer-intro"><a class="wordmark" href="/">islamade</a><p class="footer-copy">{site.description}</p><p class="footer-copy">{site.whatsappDisplay}<br>{site.email}</p><div class="social-row"><a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">ig</a><a href={site.youtube} target="_blank" rel="noreferrer" aria-label="YouTube">yt</a><a href={`https://wa.me/${site.whatsappNumber}`} target="_blank" rel="noreferrer" aria-label="WhatsApp">wa</a></div></div>
    <div><h2>Shop</h2><a href="/shop">All pieces</a><a href="/collections">Collections</a><a href="/custom">Custom orders</a></div>
    <div><h2>Studio</h2><a href="/about">Our story</a><a href={`mailto:${site.email}`}>Contact</a><a href="/about#care">Care guide</a></div>
    <div class="newsletter"><h2>Little notes from the studio</h2><p class="footer-copy">A newsletter is planned, but sign-up is not connected yet.</p><div class="newsletter-placeholder" aria-label="Newsletter coming soon">Newsletter sign-up coming soon</div></div>
  </div>
  <div class="legal shell"><span>© {new Date().getFullYear()} islamade</span><span>Made with yarn, care &amp; patience.</span></div>
</footer>
