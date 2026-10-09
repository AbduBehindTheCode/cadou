# Baby Wishlist App Plan

This app is a private, mobile-first web experience for our family and anyone who receives the link. It is designed to help us organize a simple baby wishlist and make it easy for loved ones to browse and reserve items they want to gift. The goal is to keep the list clear, practical, and convenient to use on a phone while avoiding duplicate gifts and making it easy to understand what is available, what is reserved, and what delivery details matter for each product.

Very important: the app must be mobile-friendly at every step, optimized for phone screens first, and usable comfortably with one hand. The layout, spacing, tap targets, modals, and animations should all be designed for small-screen experience before anything else.

## Product vision and design direction

The design should feel modern, soft, warm, and celebratory, with a premium baby-girl aesthetic that is stylish, light, and emotionally meaningful. The primary color should be a delicate pink palette with elevated neutrals, blush tones, warm whites, and gentle rose accents. The app should feel like a beautiful digital keepsake: elegant, romantic, and designed around the excitement of welcoming a baby girl.

The overall style should be inspired by modern baby registry, boutique lifestyle, and premium shopping brand experiences: soft gradients, floating cards, subtle shadows, rounded corners, smooth motion, and a polished mobile-first layout. The visual direction should feel feminine and contemporary without being overly childish or crowded.

This app should create a warm emotional feeling from the first screen: a soft pink mood, a calm editorial layout, elegant motion, a premium product-gallery feel, and a celebratory interaction after a reservation is completed.

## Product overview

The app should be a lightweight, easy-to-use website designed mainly for mobile screens. It will display a list of product cards with a small image, product name, a shopping link, and a visible status showing whether the item is available or reserved. Each card should also include a reserve button and a detail button that opens a popup with more product information. The page should feel simple, clean, readable, and premium, and it should suit a private use case where only our family and invited people access the list via a shared link.

## Core use case

This app is not a public marketplace. It is a private wishlist for our use and for the people we share the link with. The list is meant to help us keep track of what we want for the baby while allowing family members to reserve gifts without confusion or duplication.

## Business and technical constraints

This project should be built as a low-cost, low-maintenance, short-term product with minimal complexity. The app is expected to be used only for this specific occasion and is not meant to scale or grow into a larger platform.

Important constraints:
- Very small budget
- Very light codebase
- Minimal maintenance
- No complicated libraries or frameworks
- No authentication or login flow
- Anyone with the link can open the app and reserve items
- Product count will remain under 20 items
- No need for a large database or heavy backend infrastructure
- The app should be fast to build and easy to modify

## Recommended architecture

### Best fit: Supabase + lightweight frontend
This is the recommended setup because it gives the project a very small but reliable backend without forcing us to build custom server code.

Recommended stack:
- Frontend: React + Vite
- Language: TypeScript
- Styling: CSS modules or simple custom CSS, no heavy UI library
- Backend: Supabase
- Database: Postgres via Supabase, but only with a tiny schema
- Hosting: Vercel or Netlify for frontend, Supabase for data

Why this is the best choice:
- Lowest practical complexity for a small app
- Very affordable or free for this scale
- Easy to update product list and reservation status
- No need to maintain a custom backend
- Good for a private, shareable-link app
- Keeps the project straightforward enough for Copilot to build quickly

### Why not a heavy backend
A custom Node.js backend, a big database, authentication system, admin portal, and large libraries would be overengineering for this app. The app only needs a simple public product list and a reservation workflow. That means a small backend that stores a few tables is enough.

## No-auth requirement

This is a critical requirement:
- There must be no login, sign-up, or authentication flow.
- Anyone who receives the link can access the site.
- Users can open the list, see the products, and reserve an item without creating an account.
- The app should feel simple and frictionless.
- The app should not be public to search engines; it is only for private sharing by link.

This means the frontend and backend must be designed for public access without user accounts. No admin gate is required for the reservation flow. The app should work as a simple shareable gift list.

## Final confirmed decisions

These decisions are now fixed for implementation:
- Use Supabase only for the backend/data layer. No second backend or custom server is needed.
- No hidden password admin page will be created. Product editing will be done directly in the Supabase dashboard during this phase.
- For the initial version, only example data will be used. The app should be tested with a maximum of 3 sample products.
- Reserved items are permanently locked and can only be unlocked from the Supabase dashboard.
- The product list must show both status and delivery context: available/reserved plus a label indicating whether the item is travel-friendly, delivery-required, or Europe-only.
- The frontend repository should be kept in the project repo, and the deployed frontend URL should be configured in Supabase as the app URL and redirect/origin setting.
- The reservation form will allow a required name field and an optional short message from the giver.
- This project should not be exposed publicly in search engines.
- No login flow is required at any point.

## Data model and database design

Because the product count is very low, the database should remain simple and minimal. There is no need for a large schema or complex relationships. A single table for products and a simple reservation table is enough.

### Products table
Each product item should contain:
- id
- name
- image_url
- product_url
- description
- short_note
- status
- reserved_by
- reserved_at
- delivery_type
- delivery_note
- created_at
- updated_at

Recommended status values:
- available
- reserved

Recommended delivery_type values:
- small_travel_item
- large_home_delivery
- europe_only
- general

### Reservations table
This can be optional if the product row stores the reservation data directly, but a separate table makes it cleaner and easier to scale if needed.

A reservation record may include:
- id
- product_id
- reserver_name
- reserved_at
- notes

For this app, a direct product status update may be sufficient and simpler. The recommendation is to keep it minimal and avoid extra complexity unless there is a need to track history.

## Frontend requirements

### Main screen
- Show a list of product cards in a mobile-first layout.
- Each card contains:
  - small product image
  - product name
  - short product text or teaser
  - product link to external shop
  - status badge: available or reserved
  - details button
  - reserve button

### Product details popup
- Product detail modal should open when the user taps the details button.
- The popup should show extra information such as description, item notes, and delivery context.
- It should have a close button only.
- The reserve button should remain available on the underlying card.

### Reserve popup
- Clicking reserve opens a small modal or bottom sheet.
- It asks the user for the reserver name.
- It also accepts an optional short message from the giver.
- The form should be minimal and quick.
- The user should be able to submit the reservation without creating an account.
- After submission, the item should update to reserved immediately and show a success confirmation message.

### Delivery note
- Each item may have a delivery note such as:
  - large item: can only be delivered to our home or purchased in Europe
  - small item: can be carried from Tunisia on the flight
- Add an info button that explains this note in more detail.
- Show the note in a way that is clear but not visually heavy.
- The same item should also show a compact label indicating whether it is travel-friendly, Europe-only, or home-delivery-required.

## UX and design requirements

### Visual direction
- Primary palette should be soft pink, blush, cream, and warm white.
- Keep the design light and airy with soft gradients and a premium minimal look.
- Use rounded cards, soft shadows, and modern typography.
- Make the app feel feminine, elegant, and joyful without feeling childish.

### Motion and animation
This is a major requirement and should be treated as a visual priority.
- Add elegant entrance animations for cards and modals.
- Add subtle tap animations and hover feedback.
- Animate reserved state transitions.
- Add a celebratory success animation after reservation.
- Use soft motion, not aggressive or distracting effects.

Suggested post-reservation experience:
- success toast or modal with a warm message such as “Your gift is reserved with love.”
- subtle sparkle, heart, or checkmark animation
- smooth color change on the reserved item card

## API and backend flow

A minimal architecture should use a very small public API layer.

### Frontend reads product list
- On initial page load, fetch all active products from the products table.
- Sort by created_at or custom order value.

### Frontend reserves item
- When the user submits a reservation form:
  1. read selected product id
  2. validate that it is not already reserved
  3. update the product status to reserved
  4. store reserved_by with the entered name
  5. store optional timestamp
  6. update the UI immediately

### No admin auth
For this project, the easiest route is to treat the database as a lightweight public store and update it directly from the frontend using a simple API key or a public supabase client. This is acceptable in a private, one-time use app because the risk is low and the product count is tiny.

The implementation should still avoid exposing anything sensitive or unnecessary.

## Why this setup is the best choice for this project

- Product count is under 20, so no database scaling is needed.
- The real goal is sharing a list, not building a platform.
- The app is private and low-risk.
- A full auth system would slow the build and add unnecessary code.
- Supabase gives a clean backend without heavy setup.
- The project can be built with a small code footprint and minimal maintenance.

## Technical implementation guidance

### Recommended stack
- React + Vite
- TypeScript
- CSS modules or simple custom CSS
- Supabase client
- Very small and simple project structure

### Recommended folder structure
- src/
  - App.tsx
  - main.tsx
  - styles/
  - components/
    - ProductCard.tsx
    - ProductModal.tsx
    - ReserveModal.tsx
    - StatusBadge.tsx
  - data/
    - sampleData.ts or product service
  - lib/
    - supabase.ts

### Simplify the implementation
The app should stay straightforward:
- no routing
- no auth
- no user accounts
- no CMS
- no complex state library
- no heavy animation framework
- no backend service beyond a tiny data store

A simple animation library like CSS transitions or a tiny library is enough; there is no need for a large motion framework.

## Acceptance criteria

The app is complete when all of the following are true:
- The app is mobile-first and modern in design.
- The app uses a soft pink luxury baby-girl aesthetic.
- The main screen displays the product list in cards.
- Each card contains image, name, product link, and status.
- Users can open a product details popup.
- Users can reserve an item without login.
- Reservation requires only a name field.
- A reserved product is marked as taken and cannot be reserved again.
- There is a visible delivery note or product note for relevant items.
- The app includes elegant motion and a celebratory success state after reservation.
- The app is cheap to host and simple to maintain.
- The codebase stays minimal and easy to understand.

## Implementation notes for Copilot

Build this as a small, private, shareable web app using a minimal but practical architecture. Prioritize simplicity, low cost, low maintenance, and a premium baby-girl design. Use a lightweight React app with Supabase for storage and quick data updates, and avoid unnecessary complexity.

The app should feel modern and polished, but it should not rely on large libraries or over-engineered architecture. The full goal is to create a fast, beautiful, shareable wishlist page that works perfectly for a single, private use case and can be built without a lot of code or cost.

## Suggested next steps

- Initialize a minimal Vite + React project.
- Set up Supabase with a minimal products table.
- Add a product card list and product detail modal.
- Add a simple reservation modal without auth.
- Implement reserved state logic and UI updates.
- Add delivery notes and info button behavior.
- Add premium mobile styling and soft animations.
- Validate the flow on a mobile viewport.

## Open questions and decisions

The following decisions have been resolved for the actual implementation:

1. Supabase only: yes, this is the selected backend and data layer.
2. No hidden admin page: yes, we will not add a password-protected admin page for now.
3. Example data only: yes, for the first build we will use example products only.
4. Product count for testing: maximum of 3 products.
5. Permanent lock: yes, reserved items are permanently locked and can only be unlocked from the Supabase dashboard.
6. Dual labeling: yes, each product should show both availability status and delivery/travel information.
7. Frontend configuration: yes, the frontend repo URL should be configured in Supabase as the app URL/origin.
8. Optional message: yes, the reservation form includes an optional short giver message.
9. No login: yes, there is no login or authentication flow anywhere in the app.
10. Search engines: no, the app is not meant to be indexed by search engines.
11. Product photos: placeholder images are acceptable for the initial version if needed, but real product images are preferred.

This plan is intended to serve as a direct implementation brief for Copilot so it can build the app autonomously according to the exact low-cost, no-auth, shareable-link, mobile-first, and premium baby-girl requirements described above.

## Implementation plan by iteration with verification gates

The project should be built in short, testable iterations. Each iteration must be completed and validated before moving to the next one. This reduces risk, keeps the code simple, and ensures the app is working at every stage.

### Iteration 1: project scaffolding and base app
Goal: create a minimal working app shell.

Tasks:
- initialize the Vite React app
- install only the necessary dependencies
- create the basic project folder structure
- configure TypeScript settings
- create the base layout and mobile viewport container
- define the pink, light, modern design foundation
- ensure the shell is designed for narrow mobile screens first

Validation gate:
- app runs locally with no crashes
- page loads on a mobile-sized viewport
- base styling is visible
- the app renders the main screen placeholder without errors
- the layout fits a phone screen comfortably and remains readable

### Iteration 2: product data layer and Supabase setup
Goal: connect the app to Supabase and fetch product data.

Tasks:
- create the Supabase project
- create the products table
- add sample entries for test products
- configure the frontend environment variables
- connect the frontend to Supabase using a minimal client
- fetch and display product data from the table

Validation gate:
- app loads product data from Supabase successfully
- no network errors in the browser console
- at least 2 to 3 sample products render correctly
- product data appears in the UI in card format

### Iteration 3: product card UI and details popup
Goal: build the product display layer.

Tasks:
- create reusable product cards
- include image, name, status, delivery label, and product link
- add a details button that opens a modal with extra product information
- close-only behavior on the modal
- keep all elements mobile-first and touch-friendly
- ensure cards and popups are optimized for phone-sized screens

Validation gate:
- all product cards render properly
- clicking details opens a modal
- modal closes correctly
- card layout works on narrow screens
- button sizes are comfortable for mobile interaction
- no content overflow or clipped elements on a phone viewport

### Iteration 4: reserve flow and form validation
Goal: implement the reservation process without auth.

Tasks:
- create a reservation modal or bottom sheet
- allow a required name field
- allow optional giver message
- validate that a reserved item cannot be reserved again
- submit update to Supabase
- show success confirmation after submission
- ensure the reservation modal is mobile-friendly and comfortable to use on phone screens

Validation gate:
- reserve modal opens correctly
- submitting a name updates the product status to reserved
- reserved product displays the correct label
- duplicate reservation is blocked
- success state appears after the reservation is saved
- form is easy to complete on a phone with large touch targets and no layout issues

### Iteration 5: delivery note and tag logic
Goal: make the delivery and travel data clear for users.

Tasks:
- define delivery labels for travel-friendly, home-delivery, and Europe-only items
- show compact labels on the cards
- add info button or tooltip for the delivery explanation
- ensure the note is readable and not cluttered on mobile

Validation gate:
- each mapped product shows the correct label
- info button opens the explanation clearly
- layout remains clean on mobile screens
- labels are consistent across all products

### Iteration 6: visual polish, animations, and final UX pass
Goal: deliver the premium, child-friendly, modern feel.

Tasks:
- refine the pink palette and design spacing
- add subtle card animations and modal transitions
- animate status change and reservation success
- make sure the UI feels premium and lightweight
- adjust typography, shadows, and spacing for mobile polish

Validation gate:
- animations feel smooth and not distracting
- design remains readable and clean
- the app feels modern and intentional on mobile
- final experience matches the requested baby-girl aesthetic

### Iteration 7: final quality and deployment check
Goal: make sure the app is production-ready for a private shareable link.

Tasks:
- confirm Supabase URL and frontend URL configuration
- test the product list flow end-to-end
- test reservation behavior on live data
- verify all product states are correct
- confirm no login or auth is required
- confirm the app is private and not public to search engines
- deploy frontend and make sure the link works

Validation gate:
- app loads correctly from the deployed URL
- products render from Supabase
- reservations work in the live environment
- reserved items cannot be duplicated
- app remains usable on mobile and private by link

## Required validation checklist before moving to next iteration

Before starting each new iteration, the team should confirm all of these:
- app runs without runtime errors
- UI behaves correctly on a small mobile viewport
- relevant feature works on the current branch
- there are no obvious console errors
- data flow with Supabase is correct
- the feature is not broken by the previous step
- the experience remains mobile-friendly and easy to use on a phone

## Final release gate

The app is ready to be considered complete only when:
- all product cards render correctly
- all reserve flows work without login
- reservation updates persist to Supabase
- reserved products are permanently locked
- card labels and delivery notes are correct
- the app is styled in the requested baby-girl pink aesthetic
- animations feel polished and soft
- the app works well on mobile
- the app is comfortable and easy to use on a phone in real conditions
- the app is ready to be shared privately by link

This section is intentionally structured as a step-by-step delivery plan so Copilot can implement the app safely, test each iteration, and only proceed when the previous step is confirmed working.
