# Test Cases – BookMyShow Food & Drinks

| TC ID | Test case | Steps / input | Expected result |
|---|---|---|---|
| TC01 | Default location | Open website | Indiranagar, Bengaluru appears as default |
| TC02 | Change location | Location → Whitefield | Header location changes and restaurant list updates |
| TC03 | Search | Search “biryani” | Matching restaurants are shown |
| TC04 | Cuisine filter | Select Chinese | Chinese restaurants are prioritised |
| TC05 | Rating filter | Select 4.5+ | Restaurants below 4.5 are excluded |
| TC06 | Restaurant details | Click View details | Rating, offer, ETA, reviews and dine-in/takeout options appear |
| TC07 | Dine-in | Choose Dine in → 4 people → Birthday → Reserve | Demo reservation confirmation appears |
| TC08 | Takeout menu | Choose Takeout | 30 dishes appear; 15 Veg + 15 Non-Veg |
| TC09 | Quantity | Increase quantity to 3 | Quantity becomes 3 |
| TC10 | Add cart | Add a dish | Cart count increases and item appears in cart |
| TC11 | Remove cart item | Open cart → remove | Item disappears and totals recalculate |
| TC12 | Checkout | Add item → Continue to payment | Delivery fields + payment methods appear |
| TC13 | Payment selection | Select UPI | UPI remains selected and checkout is available |
| TC14 | Place order | Fill/skip name → Place demo order | Order confirmation with ETA/order ID appears |
| TC15 | Order history | View order history | Latest order appears |
| TC16 | Order filtering | Filter by payment/location | Matching orders only are displayed |
| TC17 | Login | Enter mobile → Send OTP → 123456 | Demo login succeeds |
| TC18 | Invalid OTP | Enter 111111 | Error message asks for correct demo OTP |
| TC19 | Responsive UI | Resize browser/mobile | Cards and filters reflow for smaller screens |
| TC20 | Persistence | Place order → refresh page | Order remains due to localStorage |

## Test result

All 20 test cases are designed to pass in the supplied frontend prototype. For the report, attach screenshots showing representative passed cases (recommended: TC02, TC04, TC06, TC08, TC10, TC12, TC14, TC15 and TC19).
