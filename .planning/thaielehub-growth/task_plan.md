# Thaielehub Growth Plan

## Objective

Keep optimizing the Thaielehub Shopify site across the official theme, images, product pages, article pages, mobile booking experience, and SEO/GEO growth while preventing accidental theme publishing mistakes.

## Workstreams

1. Theme governance
   - Keep the live theme, Advenx demo theme, and historical backup themes clearly separated.
   - Add command-level guardrails before any Shopify push.
   - Record the current theme registry in the repo so another computer can continue safely.

2. Storefront UX and mobile conversion
   - Improve mobile readability, touch targets, image crop behavior, and booking form clarity.
   - Prioritize a one-minute booking path: name, date, contact, pickup option, hotel/address, checkout.
   - Keep the existing Symmetry-inspired editorial style unless a specific demo theme is being tested.

3. Product pages
   - Maintain clear location labels for Chiang Mai, Bangkok departure, and Pattaya departure tours.
   - Keep detailed itinerary timelines, pickup guidance, hotel/address entry, and meeting-point logic.
   - Avoid WhatsApp booking CTAs unless explicitly requested.

4. Article and blog pages
   - Keep article cards readable over images, with strong contrast and non-blue editorial colors.
   - Add internal links from articles to matching products and pickup-area guidance.
   - Keep schema, FAQs, and concise direct-answer sections friendly to Google and AI search tools.

5. Image quality and performance
   - Prefer high-resolution official-site images and locally selected images with respectful distance.
   - Avoid low-resolution, awkward crops, and close-contact photos.
   - Keep image display responsive and centered on the full elephant/person scene where possible.

6. Weekly SEO/GEO content engine
   - Research current Reddit, Google, and AI-search questions every week.
   - Produce a prioritized backlog plus publish-ready article drafts.
   - Store drafts and research notes under `seo-content/`.

## Done Criteria

- Theme registry and push rules are documented.
- Scripts exist to check theme status and push only to the intended theme.
- A recurring weekly SEO/GEO content automation is active.
- Any storefront code changes pass Shopify theme check or have a clearly recorded reason if the check cannot run.
- Changes are committed and pushed to GitHub.
