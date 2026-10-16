# PAANI CLOTHING Lookbook Update

## Goal
Turn the template into a premium editorial fashion portfolio for PAANI CLOTHING. Keep it strictly non-commerce: no prices, product purchasing, cart, or checkout.

## Pages and visitor experience
- Build the homepage in the requested order, with the exact headline “Every Outfit Tells a Story.”
- Add separate Collections, New Drops, Our Story, Reviews, and Contact pages with working navigation and page-specific metadata.
- Use photographs and verified copy from the two supplied collection PDFs. Feature the newest provided collection, Monochrome Muse (July 2026), and keep YK × PAANI (January 2026) accessible as an earlier collection. Do not invent customer testimonials or garment details.
- Add collection and outfit galleries with working image lightboxes, keyboard navigation, responsive layouts, and editorial styling in the supplied ivory, espresso, and champagne palette.
- Make PAANI collection content manageable through one clear source of collection records; support publication/launch dates, featured status, and archival status as specified.

## Content management
The existing project is a blank template with no admin system. Use Lovable Cloud for persistent collection management and an owner-facing publishing workflow, rather than a local-only editor that would lose changes. Keep public pages limited to published content and support scheduled visibility, featured selection, and archiving.

## Technical details
- Preserve TanStack Start and its existing React/TypeScript structure.
- Create distinct route files for each requested page and provide a unique `head()` for every content route.
- Establish the semantic design tokens in `src/styles.css`; keep page styling token-based.
- Use the supplied PDF photographs, exclude prices and commerce details, and validate navigation and gallery behavior in the running preview.
