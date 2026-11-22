# BookMyShow – Food & Drinks Section
## Software Development Fundamentals Assignment

### 1. Title
**BookMyShow – Food & Drinks Section: Frontend System Prototype**

### 2. Problem Statement
The proposed system models the Food & Drinks section of BookMyShow, allowing users to discover nearby restaurants, filter results, view ratings and offers, choose dine-in or takeout, select food items, manage quantities, proceed through a simulated transaction, and access previous orders.

The implementation is a frontend-only prototype. Backend-dependent operations such as OTP delivery, payment processing, automatic location services and persistent restaurant databases are simulated with default values and browser localStorage.

### 3. Objectives
- Provide a simple food and restaurant discovery interface.
- Implement the specified functional and non-functional requirements.
- Demonstrate restaurant search, filters, offers, reviews and ETA.
- Provide both dine-in and takeout interaction paths.
- Implement a working cart and simulated transaction flow.
- Maintain an order-history interface.
- Test the system using representative test cases.

### 4. Stakeholders
- Customers / end users
- Restaurant partners
- BookMyShow platform/administrators
- Payment service providers (represented by mock payment options)
- Delivery partners (represented by ETA values)

### 5. Functional Requirements
1. Login using email/mobile and demo OTP.
2. Search by location and discover restaurants/cuisines.
3. Apply cuisine, food-type, price and rating filters.
4. Display restaurants according to selected filters.
5. Display restaurant reviews and ratings.
6. Display restaurant-specific offers.
7. Provide dine-in and takeout choices.
8. Allow table-reservation inputs or food/cart selection and ETA.
9. Provide a transaction/checkout window with selected offer.
10. Store completed demo orders and provide searchable/filterable order history.

### 6. Non-Functional Requirements
1. Clear email/mobile and OTP interface.
2. Location selection and displayed ETA.
3. Search/filter options for cuisine, price, rating and food type.
4. Location-specific restaurant browsing.
5. Star ratings and written reviews.
6. Payment-method segregation.
7. Dine-in/takeout usability.
8. Quantity, price, food preference and ETA visibility.
9. UPI, card, wallet and COD choices.
10. Order history can be filtered by location/payment and separated by dates.

### 7. Use-Case Diagram
**Actors:** Customer, Restaurant System, Payment Service.

**Customer use cases:** Login, Select Location, Search Restaurants, Apply Filters, View Restaurant, View Reviews, View Offers, Choose Dine-in/Takeout, Reserve Table, Browse Menu, Add to Cart, Modify Quantity, Checkout, Select Payment, View Order History.

For the report diagram, use Customer as the primary actor and connect the use cases above. Connect Payment Service to Checkout/Payment and Restaurant System to restaurant/menu information.

### 8. Sequence Diagram
Sequence:
Customer → Website: Search location
Website → Restaurant data: Request restaurants
Restaurant data → Website: Restaurant list
Website → Customer: Display filtered restaurants
Customer → Website: Select restaurant
Website → Customer: Display details/offers
Customer → Website: Select takeout
Website → Restaurant data: Request menu
Restaurant data → Website: Return menu
Customer → Website: Add item
Website → Cart: Update cart
Customer → Website: Checkout
Website → Payment Service: Select payment method (simulated)
Payment Service → Website: Payment success (simulated)
Website → Customer: Order confirmation
Website → Order History: Save order locally

### 9. State Machine Diagram
States:
**Logged Out → Logged In → Browsing → Restaurant Selected → Mode Selected → Menu Browsing → Cart Updated → Checkout → Payment Selected → Order Confirmed → Order History**

Alternative branch:
Restaurant Selected → Dine-in Selected → Reservation Details → Reservation Confirmed.

### 10. Activity Diagram
Start → Login/Continue as Guest → Select Location → Search/Filter Restaurants → Select Restaurant → View Reviews/Offers → Decision: Dine-in or Takeout.

Dine-in → Enter people/preferences/occasion → Reserve → Confirmation → End.

Takeout → Browse menu → Select quantity → Add to cart → Review cart → Apply offer → Select payment → Confirm order → Show ETA → Save to history → End.

### 11. Class Diagram
Suggested classes:
- `User`: userId, name, email, mobile
- `Location`: locationId, area, city
- `Restaurant`: restaurantId, name, cuisine, area, rating, offer, eta
- `Review`: reviewId, reviewer, rating, comment
- `Dish`: dishId, name, type, price, serving
- `CartItem`: dish, quantity
- `Cart`: items, subtotal, fees, total
- `Order`: orderId, date, location, payment, items, total
- `Payment`: paymentId, method, status
- `Reservation`: reservationId, restaurant, people, preference, occasion

### 12. Implementation Screenshots
Attach screenshots of:
1. Home page
2. Location selection
3. Restaurant filters
4. Restaurant details/reviews/offers
5. Takeout menu showing Veg/Non-Veg categories
6. Cart and quantity control
7. Checkout/payment
8. Order confirmation
9. Order history
10. Mobile/responsive view

### 13. Source Code
The project uses:
- HTML5 for structure
- CSS3 for responsive styling and the specified palette
- JavaScript for interaction, filtering, cart, checkout, reservations and local persistence
- localStorage for frontend-only state

### 14. Test Cases
Refer to `TEST_CASES.md`.

### 15. Test Results
Execute the listed test cases in a browser and attach screenshots of representative successful cases. The expected outcome for each listed test is the behaviour implemented in the prototype.

### 16. Conclusion
The BookMyShow Food & Drinks frontend prototype demonstrates the requested restaurant discovery, filtering, offer, review, dine-in, takeout, cart, transaction and order-history workflows. The system is responsive and deployable as a static website. Backend-dependent features are represented using safe demo defaults and local browser storage, allowing the core user experience and software engineering requirements to be demonstrated without a server.
