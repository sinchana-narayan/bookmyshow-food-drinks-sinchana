# BookMyShow – Food & Drinks | SDF Assignment

A frontend-only, fully interactive academic prototype for the **BookMyShow Food & Drinks** section. It is intentionally built as a static website: no backend/database is required, and browser `localStorage` provides persistence for demo login state, cart and order history.

## Requirements covered

- Login UI with email/mobile + demo OTP
- 10 Bengaluru locations
- Search + cuisine/preferences/type/price/rating filters
- 100 restaurants, ratings, offers, timings and takeout ETA
- Restaurant details + reviews
- Dine-in flow: people, food preference and occasion
- Takeout flow with 30 dishes: 15 Veg + 15 Non-Veg
- Food images, prices, serving size, quantity controls and cart
- Modifications/instructions field at checkout
- Offer applied during transaction
- UPI, card, wallet and COD payment choices
- Order confirmation + order history
- Order-history filtering by payment/location
- Responsive desktop/mobile layout
- No real payment or SMS is processed

## Run locally

1. Open this folder in VS Code.
2. Install/use the VS Code **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.
4. Or simply open `index.html` in a browser.

## Deploy to GitHub Pages

```bash
git init
git add .
git commit -m "BookMyShow Food and Drinks frontend"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bookmyshow-food-drinks.git
git push -u origin main
```

Then GitHub:
**Repository → Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → / (root) → Save**

Your URL will be:
`https://YOUR_USERNAME.github.io/bookmyshow-food-drinks/`

## Important

This is an academic frontend prototype. The OTP, payment and reservation actions are simulations. Do not enter real payment information.
