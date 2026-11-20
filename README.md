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
All forms are emailed to **info@cargochainlogistics.com** through [FormSubmit](https://formsubmit.co).
The endpoint is set at the top of `assets/site.js`. The first submission triggers a one-time
activation email from FormSubmit, and its "Activate Form" link must be clicked once.

## Editing
- Text: edit the `.html` files directly. Header and footer are repeated in every page.
- Colors and fonts: the `:root` variables at the top of `assets/styles.css`.
- Logo: `assets/logo-word.png` (header), `assets/logo-full.png`, `assets/logo-mark.png`, favicons.

## Custom domain
Add a `CNAME` file containing the domain, set it under repo **Settings → Pages**, and point DNS
(Namecheap → Advanced DNS) at GitHub Pages:
- `A` records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- `CNAME` record for `www` → `silkroaddispatch.github.io`
