# Web Work Media — Doctor Website Landing Page

Ready-to-upload static landing page rebuilt from the supplied Web Work Media design reference.

## Included
- Responsive desktop/tablet/mobile layout
- High-resolution Web Work Media logo asset
- Complete hero website mockup (not a cropped screenshot)
- Basic / Professional / Premium package cards
- bKash manual payment modal
- Transaction ID + customer details submission to WhatsApp
- FAQ, benefits, process, CTA and footer
- No external JavaScript libraries

## bKash number
Current configured number: `01751210179`

To change it, open `script.js` and edit:
```js
const SITE_CONFIG = {
  bkashNumber: '01751210179',
  whatsappNumber: '8801751210179'
};
```
Also update any visible text / tel / WhatsApp links in `index.html` if the contact number changes.

## Deploy to GitHub / Hostinger
Upload all files and the `assets` folder to your repository root. Your root should look like:

- index.html
- styles.css
- script.js
- README.md
- assets/
  - webwork-media-logo.png
  - favicon.png

If Hostinger is pulling from GitHub, deploy/pull the latest commit after uploading.

## Important: automatic bKash checkout
This version uses **manual bKash Send Money + Transaction ID verification** and is safe for a static HTML deployment.

A real automatic bKash Merchant Checkout cannot be securely implemented only in browser JavaScript. It requires valid bKash merchant API credentials and a server-side backend (for example PHP/Node) to keep the secret credentials private and verify payments.
