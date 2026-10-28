# CareBridge Asia–Germany

Independent career coaching for healthcare professionals across Asia exploring Germany. Static HTML, CSS and JavaScript; no framework or paid build tools are needed.

## Publish automatically with Cloudflare Pages

The GitHub repository stores the website. Cloudflare Pages must be connected once before changes can publish automatically.

1. Sign in to Cloudflare and open **Workers & Pages → Create application → Pages → Connect to Git** (labels may vary).
2. Authorise GitHub for **carebridgeasiagermany-afk/carebridge-website** only.
3. Select the repository and use these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `public` |
| Root directory | Leave empty / repository root |

4. Select **Save and Deploy**. Cloudflare supplies the actual `pages.dev` address after a successful deployment.
5. With Git integration enabled, commits pushed to `main` automatically trigger a new production deployment. Other branches can have previews.
6. Later, use **Custom domains** in that same Pages project to connect a purchased domain. Follow Cloudflare's DNS instructions and preserve any email MX/TXT records.

Official guides:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

No Cloudflare account, project, domain, email mailbox or payment account has been created by this repository upload.

## Edit the website on GitHub

Open a file, choose the pencil/edit button, make your changes and commit them. Once Cloudflare is connected, the deployed website updates after the build succeeds.

| What to change | File |
| --- | --- |
| Website copy, consultation fees, FAQs, contact section | `public/index.html` |
| Interactive seven-step coaching journey | `public/app.js` |
| Business enquiry email | `public/site-config.js` |
| Colours and additional section layouts | `public/colour-themes.css` |
| Base layout, typography and mobile styles | `public/style.css` |
| Main portrait selection | `public/portrait.js` |
| Photos | `public/assets/` |

### Current fees

- Initial consultation: **INR 2,500**, **30–45 minutes**.
- Follow-up consultation: **INR 500 each**.
- Group consultation: **INR 1,500 per person**, minimum **four participants** (INR 6,000 for four).

Prices are repeated in pricing cards, FAQs, enquiry subjects, contact summary and `public/app.js`. When changing them, search the repository and update all corresponding occurrences. Amounts are content, not a payment integration.

### Activate email enquiries

Edit `public/site-config.js` and set the business email address, for example:

```js
window.CAREBRIDGE_CONFIG = { contactEmail: "hello@your-domain.example" };
```

Replace the example with an actual address you control. It is currently empty because no business enquiry address has been supplied. When configured, email buttons open the visitor's mail application with a consultation-specific subject. No email is sent automatically and no booking is confirmed.

Do not put passwords, API secrets, bank/card details or customer records in this repository. Only the public enquiry address belongs in this configuration file.

### Colour versions

- `/` — violet-and-blue design with the Indian healthcare portrait (default).
- `/?palette=blue` — blue-and-violet alternative.
- `/colours.html` — side-by-side colour comparison.
- `/#across-asia` — additional East Asian and Sri Lankan women healthcare portraits.

The three generated portraits are illustrative fictional professionals, not staff or clients. The original stock healthcare and Germany images are retained. Generated portraits have been exported as smaller JPEGs for faster loading.

### Payments and business details

Online payment collection is **not enabled**. Use activated merchant-hosted payment pages/checkout when ready; never collect raw card details in this static site. Add confirmed booking, cancellation/refund and operator details before offering live appointments.

## Local preview and validation

```sh
python3 -m http.server 8000 --directory public
```

Open `http://localhost:8000` in your browser. Optional file/link validation with Node.js:

```sh
node scripts/check-site.mjs
```

## Existing preview

The earlier ChatGPT Sites publication is separate from this repository. Editing GitHub does not update that earlier publication. Automatic updates apply to the Cloudflare deployment after the Git connection is completed.
