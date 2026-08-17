# Kush-n-Cozzy

Kush-n-Cozzy is a React storefront app built with Vite. It lets users browse products, view product details, add items to a cart, check out, and log in as either a client or admin. The app uses a local JSON Server backend for mock product, order, and auth data.

The app was built collaboratively as part of the Moringa School Software Engineering program, with each team member owning a distinct slice: page shell and navigation, the shop and product browsing experience, the About and Contact pages, product detail and quantity selection, and — the focus of this README's detailed breakdown — authentication, product management, and the cart/checkout flow.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Run the Project](#run-the-project)
- [Default Login Credentials](#default-login-credentials)
- [Main Routes](#main-routes)
- [Scripts](#scripts)
- [Project Architecture](#project-architecture)
- [Features by Component](#features-by-component)
- [State Management](#state-management)
- [Team & Roles](#team--roles)
- [Notes](#notes)
- [Project Status](#project-status)

---

## Features

- Product catalog with search and category filtering
- Product detail page with quantity selection
- Shopping cart with quantity updates and totals
- Checkout form and order confirmation page
- Login flow for client/admin users
- Admin product creation and product deletion
- Responsive storefront layout
- Local data persistence for cart contents with `localStorage`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend framework | React 18 |
| Build tool | Vite |
| Routing | React Router DOM (nested routes via `<Outlet />`) |
| State management | React `useState` / `useEffect`, React Context API |
| Mock backend | JSON Server, reading from `db.json` |
| Styling | Custom CSS with CSS variables, Baloo 2 / Inter / IBM Plex Mono (Google Fonts) |
| Data persistence (cart) | `localStorage`, synced via Context |

## Project Structure

```bash
kush-n-cozzy/
├── db.json
├── index.html
├── package.json
├── vite.config.js
├── public/
├── src/
│   ├── api/
│   │   └── products.js
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── House.jsx
│   │   ├── login.jsx
│   │   ├── OrderConfirmation.jsx
│   │   └── SearchBar.jsx
│   ├── pages/
│   │   ├── NewProduct.jsx
│   │   ├── NotFound.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductDetails.jsx
│   │   └── ProductList.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── CartContext.jsx
│   ├── index.css
│   ├── main.jsx
│   └── setupTests.js
├── README.md
└── package-lock.json
```

## Prerequisites

Make sure you have installed:

- Node.js (version 18 or later recommended)
- npm

## Installation

1. Clone or open the project folder.
2. Install dependencies:

```bash
npm install
```

## Run the Project

### Start the frontend

```bash
npm run dev
```

The app will start in development mode. Vite usually opens it at:

```bash
http://localhost:5173
```

If port 5173 is occupied, Vite will automatically choose another available port.

### Start the mock backend

Open a second terminal and run:

```bash
npm run server
```

This starts JSON Server using the data in `db.json` at:

```bash
http://localhost:4000
```

> **Note:** The frontend and backend must run together for the app to work correctly — the frontend expects the API at `http://localhost:4000`.

## Default Login Credentials

The mock authentication data is stored in `db.json`:

- Client account: `client1` / `client123`
- Admin account: `admin1` / `admin123`

## Main Routes

- `/` — Home / product catalog
- `/products` — Product catalog
- `/about` — About page
- `/contact` — Contact page
- `/login` — Login page
- `/add-product` — Add a new product
- `/cart` — Shopping cart
- `/checkout` — Order checkout
- `/order-con
- `/product/:id` — Product details
- `*` — Not found page
## Scripts
 
```bash
npm run dev      # start the frontend dev server
npm run build    # build the production app
npm run preview  # preview the production build
npm run server   # start the JSON Server backend
```
 
---
 
## Project Architecture
 
The app uses a **shell + nested routes** pattern. `House.jsx` renders the persistent navigation and layout, and every other page (Login, Products, Product Details, About, Contact, Cart, Checkout, Order Confirmation, Add Product) renders inside it via React Router's `<Outlet />`. This means the navbar, sidebar, and footer never re-mount as the user moves between pages — only the inner content swaps out.
 
Cart state is lifted out of any single page and into `CartContext`, so any component in the tree — the navbar's cart icon, product cards, the cart page, and checkout — can read from and write to the same cart without prop-drilling.
 
---
 
## Features by Component
 
### House.jsx — App Shell
*Built by: Enos Arenga*
 
`House.jsx` is the structural frame around the entire site. It does not render any page-specific content itself — instead, it provides the consistent scaffolding every page sits inside:
 
- **Top navbar** with links to Home, About, Contact, and Login.
- **Left sidebar** with store-management navigation (Products, Add Product, and related admin links).
- **Footer** anchored at the bottom of every page.
- **`<Outlet />`** in the center of the layout, which is where React Router injects whichever nested route is currently active.
Because the shell is a parent route and everything else is a child route nested inside it, navigating the app never causes the navbar, sidebar, or footer to flicker or re-render — only the content in the middle changes.
 
### ProductList.jsx — Shop Page
*Built by: Lynn Kyalo*
 
This is the main shopping page and the first place customers browse the store's inventory.
 
- **Data fetching:** On mount, it performs an asynchronous fetch request to the backend (JSON Server serving `db.json`) to retrieve the full product catalog.
- **Network status handling:** Renders inline fallback notifications when the fetch is taking a while to load or fails outright, so the user isn't left staring at a blank screen with no explanation.
- **Grid display:** Products are rendered as a responsive grid of `ProductCard` components, each showing the product's image, name, and price.
- **Live search:** A search bar filters the visible products in real time as the user types — no page reload or additional network request is needed, since filtering happens against the already-fetched data in state.
- **Multi-field filtering:** The search checks the user's query against the product's name, category tag, and description simultaneously, rather than matching on the name alone.
- **Case-insensitive matching:** Search input is normalized before comparison, so a query matches regardless of how the user capitalizes it.
- **Category filtering:** Category buttons let the user narrow the grid to a specific product type. Search and category filtering can be combined.
- **Navigation to detail view:** Clicking any product card routes the user to that product's dedicated detail page (`ProductDetails.jsx`), passing along the product's unique identifier via the URL.
### About.jsx — About Page
*Built by: Lynn Kyalo*
 
A static informational page introducing the Kush-n-Cozzy brand to visitors.
 
- Displays the company's mission statement alongside a high-quality image of the team/workspace.
- Includes a responsive visual container showing company milestones (e.g. customer reach figures).
- Documents the store's checkout safety protocols for customer transparency and trust.
### Contact.jsx — Contact Page
*Built by: lynnflorence*
 
A simple, dedicated page listing the store's contact information for customers who want to reach out directly.
 
- Displays contact details (such as phone, email, and/or location) by mapping over an array
*Built by: lynnflorence*
 
A simple, dedicated page listing the store's contact information for customers who want to reach out directly.
 
- Displays contact details (such as phone, email, and/or location) by mapping over an array of contact entries with `.map()`, keeping the list data-driven rather than hardcoded into the markup.
- Straightforward and lightweight by design — it's a reference page rather than an interactive one, so no fetch or form logic is needed.
### ProductDetails.jsx — Product Detail Page
*Built by: Lynn Kyalo*
 
A dedicated, deep-dive landing page for a single product, reached by clicking a card in `ProductList.jsx`.
 
- **Dynamic route binding:** Reads the product's unique identifier directly from the browser URL using React Router's `useParams` hook.
- **Isolated data lookup:** Queries the local product dataset to find and render only the specific product object matching that URL identifier.
- **Interactive quantity selector:** Tracks the planned order quantity locally, incrementing and decrementing via simple calculation.
- **Lower-bound validation:** Enforces a strict floor of 1, preventing the user from decrementing into zero or negative values.
- **Checkout total:** Calculates and displays the total cost (unit price × quantity) as the quantity changes, so the customer always sees an up-to-date total before proceeding to checkout.
### ProductCard.jsx — Product Card
*Built by: lynnflorence*
 
A small, reusable presentational component used to display a single product wherever a product needs to be shown in a list — most notably inside `ProductList.jsx`'s grid.
 
- Renders the product's image, key details (name, category, etc.), and price in a consistent card layout.
- Includes a link that routes to that product's dedicated detail page (`ProductDetails.jsx`), passing the product's identifier along.
- Kept intentionally simple and reusable — it takes a product as a prop and focuses purely on presentation, so the same card can be reused anywhere a product needs to be listed.
### login.jsx — Authentication
*Built by: Lerionka*
 
The entry point of the application (the `index` route rendered inside `House.jsx`).
 
- Provides a login form for returning users and a role toggle for distinguishing between client and admin access within the app, matching the credentials stored in `db.json`.
- Manages form input state locally with `useState`, updating fields as the user types.
- Validates input before allowing the user to proceed further into the app.
- Sets the tone for the site's visual identity — the "sticker card" aesthetic (thick borders, hard drop shadows, and the Baloo 2 / IBM Plex Mono typography pairing) that carries through the rest of the app.
### NewProduct.jsx — Product Management
*Built by: Lerionka*
 
The admin-facing page for adding new inventory to the store, reachable from the sidebar's "Add Product" link.
 
- Presents a form for entering a new product's details (name, price, category, description, and image).
- Manages all form fields as controlled inputs using `useState`.
- On submission, sends the new product data to the backend (JSON Server) so it's persisted to `db.json` and immediately becomes available in `ProductList.jsx`.
- Includes basic validation and error feedback so incomplete or invalid product entries aren't submitted.
- Works alongside product deletion, giving admins full control over store inventory.
### Cart, Checkout & Order Confirmation
*Built by: Lerionka*
 
This is the transactional core of the store — the flow that takes a customer from "I want this" to "order placed." It's built as three connected pieces plus a shared context.
 
**`CartContext.jsx`** — A React Context provider that holds the cart's state (the list of items, each with a quantity) for the entire app. It exposes:
- `addToCart(product, quantity)` — adds a new item or increases the quantity of an existing one.
- `removeFromCart(productId)` — removes an item entirely.
- `updateQuantity(productId, quantity)`
### Cart, Checkout & Order Confirmation
*Built by: Lerionka*
 
This is the transactional core of the store — the flow that takes a customer from "I want this" to "order placed." It's built as three connected pieces plus a shared context.
 
**`CartContext.jsx`** — A React Context provider that holds the cart's state (the list of items, each with a quantity) for the entire app. It exposes:
- `addToCart(product, quantity)` — adds a new item or increases the quantity of an existing one.
- `removeFromCart(productId)` — removes an item entirely.
- `updateQuantity(productId, quantity)` — adjusts how many of an item are in the cart, with a built-in floor of 1.
- `clearCart()` — empties the cart, used after a successful order.
- `totalItems` and `totalPrice` — derived values recalculated automatically whenever the cart changes.
The cart is persisted to `localStorage`, so a customer's cart survives a page refresh or an accidental tab close.
 
**`Cart.jsx`** — The cart review page.
- Lists every item currently in the cart with its image, name, unit price, and running subtotal.
- Lets the customer increase or decrease quantity per item, or remove an item outright, all updating the shared cart state instantly.
- Displays the cart's grand total and a "Proceed to Checkout" action.
- Shows a friendly empty-state message with a link back to the shop if the cart has nothing in it.
**`Checkout.jsx`** — The checkout page.
- Displays a summary of the order (items, quantities, and total) pulled directly from `CartContext`.
- Presents a form collecting the customer's full name, email, phone number, delivery address, and preferred payment method (Cash on Delivery, M-Pesa, or Card).
- On submission, packages the cart contents and customer details into an order object and sends it to the backend as a `POST` request to the JSON Server API (`http://localhost:4000/orders`).
- Handles loading and error states — the submit button disables and shows "Placing Order..." while the request is in flight, and a clear error message appears if the request fails.
- On success, clears the cart and redirects the customer to the order confirmation page.
**`OrderConfirmation.jsx`** — A simple confirmation screen shown after a successful checkout, thanking the customer and providing a way back to the shop.
 
---
 
## State Management
 
Kush-n-Cozzy avoids a heavier state library in favor of React's built-in tools, matched to the scale of the app:
 
- **Local component state** (`useState`) handles anything scoped to a single page or form — login fields, the new-product form, quantity selectors, and search/filter input.
- **`useEffect`** handles side effects tied to a component's lifecycle — fetching products on mount, and syncing the cart to `localStorage` whenever it changes.
- **Context API** (`CartContext`) handles state that needs to be shared across otherwise unrelated components — the cart icon in the navbar, the product grid's "Add to Cart" buttons, the cart page, and checkout all read from and write to the same source of truth without passing props down through every layer of the component tree.
---
 
## Team & Roles
 
| Area | Component(s) | Owner |
|---|---|---|
| App shell & navigation | Enos Arenga|
| `House.jsx` | Fiona Muthomi |

| Shop / product browsing | `ProductList.jsx` | Fiona Muthomi |
|Test files | Fiona Muthomi |
| About page | `About.jsx` | Lynn Kyalo |
| Contact page | `Contact.jsx` | lynnflorence |
| Product detail & quantity | `ProductDetails.jsx` | Lynn Kyalo |
| Product card (reusable) | `ProductCard.jsx` | lynnflorence |
| Authentication | `login.jsx` | Lerionka |
| Product management | `NewProduct.jsx` | Lerionka |
| Cart & checkout | `CartContext.jsx`, `Cart.jsx`, `Checkout.jsx`, `OrderConfirmation.jsx` | Lerionka |
|Footer| Not FoundPage| Enos Arenga
 
---
 
## Notes
 
- The app uses a local mock API instead of a production backend.
- Cart data is stored in browser `localStorage`.
- The backend and frontend are meant to run together for the app to work correctly — the frontend expects the API at `http://localhost:4000`.
## Project Status
 
This project is configured for local development and demo use as a full storefront application, and is actively in development as part of Moringa School coursework. Core shopping flow (browse → product detail → cart → checkout → confirmation), authentication, and product management are functional.