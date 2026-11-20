# CargoChain Logistics LLC — website

Static website (plain HTML/CSS/JS, no build step), hosted on GitHub Pages.
USDOT 4081213 · MC 1552696 · West Chester, OH

## Pages
| File | Audience |
|---|---|
| `index.html` | Everyone: routes visitors to the right page |
| `owner-operators.html` | Box truck owner-operators: 88% program, earnings calculator, application |
| `drivers.html` | Drivers (non-CDL OK): application |
| `shippers.html` | Direct shippers: expedited / recurring / dedicated quote requests |
| `brokers.html` | Freight brokers: carrier packet, daily truck list, load tenders |
| `about.html` | Company info and contact |

## Forms
All seven forms POST to **info@cargochainlogistics.com** through [FormSubmit](https://formsubmit.co/documentation). Each HTML form contains its endpoint, subject, and source URL. Native submission opens the provider security check; CAPTCHA is enabled by default and the provider recognizes the hidden `_honey` field. JavaScript adds duplicate-submit protection and restores buttons on browser Back. No client-side success message claims delivery.

Inbox activation is required. A real QA request on November 20, 2026 reached the provider, which reported that an activation email was sent. Inbox activation and final message receipt are still pending verification. After activation, test each form on the production domain and verify its subject and fields in the inbox. Spam protection reduces automation; it cannot eliminate human scams or all spam.

## Editing
- Text: edit the `.html` files directly. Header and footer are repeated in every page.
- Colors and fonts: the `:root` variables at the top of `assets/styles.css`.
- Refreshed design: `assets/refresh.css` supplies the shared visual system and responsive homepage layouts.
- Brand theme: `assets/light.css` applies the blue, orange, and white palette, Manrope/Inter typography, lighter panels, and responsive truck photography composition.
- Motion: one-time entrance and section reveals respect `prefers-reduced-motion`; all content remains available without JavaScript.
- Truck artwork: `assets/cargochain-truck-branded.webp` is AI-enhanced marketing imagery based on the owner's supplied truck photo and CargoChain logo. The owner requested a pristine truck, polished grille/bumper, and large box branding. It is not an unedited fleet photograph. The optimized 1536×1024 WebP is approximately 209 KB.
- Official FleetOptimus wordmark: `assets/fleetoptimus-logo.webp`, sourced from https://www.fleetoptimus.com/images/logo-nav-light.webp.
- FleetOptimus: technology sections describe the TMS used by CargoChain for operational coordination. These are informational sections, not a live customer portal.
- Logo: `assets/logo-word.png` (header), `assets/logo-full.png`, `assets/logo-mark.png`, favicons.

## Verification and launch
- Check desktop and mobile navigation, all audience links, broker tab keyboard navigation and direct links.
- The earnings estimate includes fuel for both loaded and empty miles. Default values are illustrative, before tax, and are not a pay guarantee.
- Form handling uses native browser validation, provider CAPTCHA, a server-recognized honeypot, and duplicate-submit protection. Confirm inbox activation and real delivery before launch.
- Current fleet size, insurance limits, recruiting terms, and service availability should be kept up to date by the business.

## Custom domain
Add a `CNAME` file containing the domain, set it under repo **Settings → Pages**, and point DNS
(Namecheap → Advanced DNS) at GitHub Pages:
- `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `CNAME` record for `www` → `silkroaddispatch.github.io`
