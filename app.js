const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => `₹${Math.max(0,Math.round(n)).toLocaleString("en-IN")}`;
const esc = s => String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;");

let state = {
  location: locations[0],
  cart: [],
  orders: [],
  bookings: [],
  user: null,
  selectedOffers: {},
  currentRestaurantId: null
};

function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function openModal(id){$(id).classList.add("open")}
function closeModals(){$$(".modal").forEach(m=>m.classList.remove("open"));$("#cartDrawer").classList.remove("open")}
function save(){localStorage.setItem("bmsLocation",state.location);localStorage.setItem("bmsCart",JSON.stringify(state.cart));localStorage.setItem("bmsOrders",JSON.stringify(state.orders));localStorage.setItem("bmsBookings",JSON.stringify(state.bookings));localStorage.setItem("bmsUser",JSON.stringify(state.user));localStorage.setItem("bmsOffers",JSON.stringify(state.selectedOffers));updateCartCount();renderUserStatus()}
function updateCartCount(){$("#cartCount").textContent=state.cart.reduce((s,x)=>s+x.qty,0)}
function priceBand(r){return r.averageCost<500?"budget":r.averageCost<=1000?"mid":"premium"}

function init(){
  // A fresh browser refresh intentionally restores the prototype to its default demo state.
  ["bmsLocation","bmsCart","bmsOrders","bmsBookings","bmsUser","bmsOffers"].forEach(k=>localStorage.removeItem(k));
  $("#currentLocation").textContent=state.location;
  $("#locationFilter").innerHTML=locations.map(x=>`<option value="${esc(x)}" ${x===state.location?"selected":""}>${esc(x)}</option>`).join("");
  const cuisines=[...new Set(restaurants.map(r=>r.cuisine))].sort();
  $("#cuisineFilter").innerHTML='<option value="all">All cuisines</option>'+cuisines.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join("");
  renderUserStatus();
  updateActiveFilters();
  renderRestaurants();
  renderReview();
  updateCartCount();
  $("#locationBtn").onclick=()=>{renderLocations();openModal("#locationModal")};
  $("#loginBtn").onclick=()=>{renderLoginContent();openModal("#loginModal")};
  $("#checkoutBtn").onclick=checkout;
  $("#bookingsNav").onclick=e=>{e.preventDefault();openBookings()};
  $("#ordersNav").onclick=e=>{e.preventDefault();openOrders()};
  $("#cartBtn").onclick=()=>{renderCart();$("#cartDrawer").classList.add("open")};
  $("#viewAllBtn").onclick=()=>{clearFilters();$("#restaurants").scrollIntoView({behavior:"smooth"})};
  $("#searchBtn").onclick=runSearch; $("#heroSearch").addEventListener("keydown",e=>e.key==="Enter"&&runSearch());
  $$("#hero .quick-tags button").forEach(b=>b.onclick=()=>{$("#cuisineFilter").value=b.dataset.cuisine;renderRestaurants();$("#restaurants").scrollIntoView({behavior:"smooth"})});
  ["locationFilter","cuisineFilter","typeFilter","priceFilter","ratingFilter"]
  .forEach(id => {
    $("#" + id).onchange = () => {
      updateActiveFilters();

        const searchText = $("#heroSearch").value
        .toLowerCase()
        .trim();

      renderRestaurants(searchText);

      $("#restaurants").scrollIntoView({
        behavior: "smooth"
      });
    };
  });
  $("#clearFilters").onclick=clearFilters;
  $("#manualLocationForm").onsubmit=e=>{e.preventDefault();const v=$("#manualLocation").value.trim();if(v){state.location=v;$("#currentLocation").textContent=v;$("#locationFilter").value="";save();closeModals();renderRestaurants();toast(`Location set to ${v}`)}};
  $("#promoBtn").onclick=()=>{$("#restaurants").scrollIntoView({behavior:"smooth"});toast("Showing restaurants and their active offers.")};
  $$(".offer-card button").forEach(b=>b.onclick=()=>{$("#restaurants").scrollIntoView({behavior:"smooth"});toast("Choose a restaurant to view its offer.")});
  $$(".close,[data-close]").forEach(b=>b.onclick=closeModals);
  window.addEventListener("click",e=>{if(e.target.classList.contains("modal"))closeModals()});
  window.addEventListener("hashchange",()=>{if(location.hash==="#orders")openOrders()});
}

function renderUserStatus(){
  const user=state.user;
  $("#loginBtn").textContent=user?"Account":"Login";
  $("#loginBtn").title=user?`Logged in as ${user.email}`:"Login";
  $("#userStatus").textContent=user?`Logged in as ${user.email}`:"Not logged in";
}
function renderLoginContent(){
  const box = $("#loginContent");

  if(state.user){
    box.innerHTML = `
      <p class="eyebrow">ACCOUNT</p>
      <h2>You are signed in.</h2>

      <div class="account-confirm">
        <div class="account-avatar">
          ${esc(state.user.email.charAt(0).toUpperCase())}
        </div>

        <div>
          <strong>Logged in as ${esc(state.user.email)}</strong>
          <small>Mobile: ${esc(state.user.mobile)}</small>
        </div>
      </div>

      <button class="dark-btn full" id="logoutBtn">
        Log out / switch account
      </button>

      <p class="demo-note">
        Choose this option to return to the sign-in screen.
      </p>
    `;

    $("#logoutBtn").onclick = () => {
      state.user = null;
      save();
      renderLoginContent();
      toast("Logged out. You can switch accounts now.");
    };

    return;
  }

  box.innerHTML = `
    <p class="eyebrow">SIGN IN</p>
    <h2>Welcome back.</h2>

    <div class="form-grid">

      <label>
        Email
        <input
          id="loginEmail"
          type="email"
          placeholder="you@example.com"
        >
      </label>

      <label>
        Mobile
        <input
          id="loginMobile"
          maxlength="10"
          placeholder="10-digit mobile number"
        >
      </label>

      <button class="dark-btn full" id="sendOtp">
        Send OTP
      </button>

    </div>

    <div id="otpArea" class="hidden">
      <label>
        Enter demo OTP
        <input
          id="otp"
          maxlength="6"
          placeholder="123456"
        >
      </label>

      <button class="dark-btn full" id="verifyOtp">
        Verify & continue
      </button>
    </div>

    <p class="demo-note">
      Demo mode: OTP is <b>123456</b>. No SMS is sent.
    </p>
  `;

  // IMPORTANT:
  // These listeners were missing.
  $("#sendOtp").onclick = () => {
    const email = $("#loginEmail").value.trim();
    const mobile = $("#loginMobile").value.trim();

    if(!email || !mobile){
      toast("Enter your email and mobile number first.");
      return;
    }

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
      toast("Enter a valid email address.");
      return;
    }

    if(!/^\d{10}$/.test(mobile)){
      toast("Enter a valid 10-digit mobile number.");
      return;
    }

    $("#otpArea").classList.remove("hidden");
    $("#otp").focus();

    toast("Demo OTP sent. Use 123456.");
  };

  $("#verifyOtp").onclick = verifyLogin;
}
function verifyLogin(){
  const email=$("#loginEmail").value.trim(), mobile=$("#loginMobile").value.trim(), otp=$("#otp").value.trim();
  if(!email||!mobile){toast("Enter your email and mobile number first.");return}
  if(otp!=="123456"){toast("Use demo OTP 123456.");return}
  state.user={email,mobile};save();renderLoginContent();toast(`Logged in as ${email}`);
}
function updateActiveFilters(){
  const chips = [];

  const cuisine = $("#cuisineFilter").value;
  const type = $("#typeFilter").value;
  const price = $("#priceFilter").value;
  const rating = $("#ratingFilter").value;
  const location = $("#locationFilter").value;

  if(cuisine !== "all"){
    chips.push(`Cuisine: ${cuisine}`);
  }

  if(type !== "all"){
    chips.push(`Type: ${type}`);
  }

  if(price !== "all"){
    const labels = {
      budget: "Under ₹500",
      mid: "₹500–₹1000",
      premium: "₹1000+"
    };

    chips.push(`Price: ${labels[price]}`);
  }

  if(rating !== "all"){
    chips.push(`Rating: ${rating}+`);
  }

  if(location !== "all"){
    chips.push(`Location: ${location.split(",")[0]}`);
  }

  $("#activeFilters").innerHTML =
    chips.map(x => `<span class="filter-chip">${esc(x)}</span>`).join("");
}
function clearFilters(){
  ["cuisineFilter","typeFilter","priceFilter","ratingFilter"]
    .forEach(id => $("#" + id).value = "all");

  $("#locationFilter").value =
    locations.includes(state.location)
      ? state.location
      : "all";

  $("#heroSearch").value = "";

  updateActiveFilters();

  renderRestaurants();
}
function runSearch(){
  const q = $("#heroSearch").value
    .toLowerCase()
    .trim();

  renderRestaurants(q);

  updateActiveFilters();

  $("#restaurants").scrollIntoView({
    behavior: "smooth"
  });
}
function renderLocations(){$("#locationOptions").innerHTML=locations.map(l=>`<button class="location-option" onclick="setLocation('${l.replaceAll("'","\\'")}')"><strong>⌖ ${esc(l.split(",")[0])}</strong><small>Restaurants, cafés & food courts</small></button>`).join("")}
window.setLocation=l=>{state.location=l;$("#currentLocation").textContent=l;$("#locationFilter").value=l;save();closeModals();renderRestaurants();toast(`Location changed to ${l}`)}

function restaurantMatchesSearch(r,search){
  if(!search)return true;
  const signature=r.signatureDishIds.map(id=>dishes.find(d=>d.id===id)?.name||"").join(" ");
  return `${r.name} ${r.cuisine} ${r.area} ${signature}`.toLowerCase().includes(search);
}
function renderRestaurants(search=""){
  const loc=$("#locationFilter").value || state.location;
  const cuisine=$("#cuisineFilter").value,type=$("#typeFilter").value,price=$("#priceFilter").value,rating=$("#ratingFilter").value;
  let arr=restaurants.filter(r=>
    restaurantMatchesSearch(r,search) &&
    ((!locations.includes(state.location)) || loc==="all" || `${r.area}, Bengaluru`===loc || state.location===r.area) &&
    (cuisine==="all" || r.cuisine===cuisine) &&
    (type==="all" || r.type===type || r.type==="Both") &&
    (price==="all" || priceBand(r)===price) &&
    (rating==="all" || r.rating>=+rating)
  );
  $("#resultCount").textContent=`${arr.length} restaurant${arr.length===1?"":"s"} found`;
  $("#restaurantGrid").innerHTML=arr.length?arr.map(card).join(""):`<div class="empty" style="grid-column:1/-1">No restaurants match these filters. Try another cuisine, price range or location.</div>`;
}
function card(r){return `<article class="restaurant-card">
<div class="restaurant-img"><img loading="lazy" src="${r.image}" alt="${esc(r.name)} restaurant interior"><span class="badge">${esc(r.cuisine.toUpperCase())}</span><span class="rating">★ ${r.rating}</span></div>
<div class="restaurant-info"><h3>${esc(r.name)}</h3><div class="meta">${r.price} • ${esc(r.hours)}</div><div class="offer-line">⌁ ${esc(r.offers[0].title)} • ${esc(r.offers[0].text)} • Takeout ${esc(r.eta)}</div>
<div class="card-actions"><button class="secondary" onclick="openRestaurant(${r.id})">View details</button><button class="primary" onclick="openMenu(${r.id})">Takeout →</button></div></div></article>`}

function signatureDishes(r){return r.signatureDishIds.map(id=>dishes.find(d=>d.id===id)).filter(Boolean)}
window.openRestaurant=id=>{const r=restaurants.find(x=>x.id===id);const sig=signatureDishes(r);$("#restaurantDetail").innerHTML=`
<div class="detail-hero"><img src="${r.image}" alt="${esc(r.name)} restaurant"><div><p class="eyebrow">${esc(r.cuisine)} • ${esc(r.area)}</p><h2>${esc(r.name)}</h2><div class="stars">★★★★★ <span style="color:var(--muted);font-size:11px">${r.rating} / 5</span></div><div class="info-pills"><span>⌖ ${r.eta} takeout</span><span>${r.price} • Avg ${money(r.averageCost)}</span><span>${r.hours}</span></div><p class="muted">${esc(r.offers[0].title)}: ${esc(r.offers[0].text)}<br>${esc(r.offers[1].title)}: ${esc(r.offers[1].text)}</p><div class="detail-actions"><button class="dark-btn" onclick="openMenu(${r.id})">Takeout menu →</button><button style="background:#f4e6cf" onclick="openDine(${r.id})">Dine in</button></div></div></div>
<h3 class="detail-heading">Signature dishes at ${esc(r.name)}</h3><div class="signature-grid">${sig.map(d=>`<article><img src="${d.image}" alt="${esc(d.name)}"><div><b>${esc(d.name)}</b><p>${esc(d.desc)}</p><strong>${money(d.price)}</strong></div></article>`).join("")}</div>
<div class="offer-detail-grid">${r.offers.map(o=>`<label class="offer-choice"><input type="checkbox" ${state.selectedOffers[r.id]?.includes(o.id)?"checked":""} onchange="toggleOffer(${r.id},'${o.id}')"><span><b>${esc(o.title)}</b><small>${esc(o.text)}</small></span></label>`).join("")}</div>
<div class="review-list"><h3 style="font-size:25px">Reviews</h3>${r.reviews.map(v=>`<div class="review-mini"><b>${esc(v.name)} • ★ ${v.rating}</b><span>${esc(v.text)}</span></div>`).join("")}</div>`;openModal("#restaurantModal")}
window.toggleOffer=(rid,oid)=>{const arr=state.selectedOffers[rid]||[];const wasSelected=arr.includes(oid);state.selectedOffers[rid]=wasSelected?arr.filter(x=>x!==oid):[...arr,oid];save();toast(wasSelected?"Offer removed":"Offer applied")}
window.openDine=id=>{const r=restaurants.find(x=>x.id===id);$("#restaurantDetail").innerHTML=`<p class="eyebrow">DINE IN</p><h2>Reserve a table at ${esc(r.name)}</h2><p class="muted">Choose your table preferences. This is a frontend-only reservation flow for the assignment.</p><div class="form-grid"><label>Number of people<select id="people"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5+</option></select></label><label>Preferred time<select id="time"><option>6:30 PM</option><option selected>7:30 PM</option><option>8:30 PM</option><option>9:00 PM</option></select></label><label>Food preference<select id="pref"><option>No preference</option><option>Vegetarian</option><option>Non-vegetarian</option><option>Vegan</option></select></label><label>Decoration / occasion<select id="occasion"><option>None</option><option>Birthday</option><option>Anniversary</option><option>Casual celebration</option></select></label><button class="dark-btn full" onclick="confirmDine(${r.id})">Reserve table →</button></div>`;openModal("#restaurantModal")}
window.confirmDine=id=>{
  const r=restaurants.find(x=>x.id===id);
  const booking={
    id:"BK"+Date.now().toString().slice(-6), restaurant:r.name, location:r.area+", Bengaluru",
    date:new Date().toLocaleDateString("en-IN"), time:$("#time")?.value||"7:30 PM",
    people:$("#people").value, preference:$("#pref").value, occasion:$("#occasion").value, status:"Confirmed"
  };
  state.bookings.unshift(booking); save(); closeModals(); toast(`Table confirmed at ${r.name}`); openBookings();
}

window.openMenu=id=>{const r=restaurants.find(x=>x.id===id);state.currentRestaurantId=id;$("#menuDetail").innerHTML=`<div class="menu-header"><div><p class="eyebrow">TAKEOUT MENU</p><h2>${esc(r.name)}</h2><p class="muted">${esc(r.cuisine)} • ETA ${esc(r.eta)}</p></div><button class="outline-btn" onclick="closeModals();openRestaurant(${r.id})">Restaurant details</button></div><div class="menu-offers">${r.offers.map(o=>`<label class="offer-choice compact"><input type="checkbox" ${state.selectedOffers[r.id]?.includes(o.id)?"checked":""} onchange="toggleOffer(${r.id},'${o.id}')"><span><b>${esc(o.title)}</b><small>${esc(o.text)}</small></span></label>`).join("")}</div><div class="menu-tabs"><button class="active" data-type="all">All</button><button data-type="Veg">Veg</button><button data-type="Non-Veg">Non-Veg</button></div><div class="menu-grid" id="dishGrid"></div>`;openModal("#menuModal");renderDishes("all");$$('.menu-tabs button').forEach(b=>b.onclick=()=>{$$('.menu-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderDishes(b.dataset.type)})}
function renderDishes(type){const arr=type==="all"?dishes:dishes.filter(d=>d.type===type);$("#dishGrid").innerHTML=arr.map(d=>`<article class="dish"><img loading="lazy" src="${d.image}" alt="${esc(d.name)}"><div><span class="badge" style="position:static;display:inline-block">${d.type}</span><h4>${esc(d.name)}</h4><p>${esc(d.desc)}</p><div class="dish-meta">${money(d.price)} • ${esc(d.serving)}</div><div class="dish-controls"><div class="qty"><button onclick="changeQty(${d.id},-1)">−</button><span id="qty-${d.id}">1</span><button onclick="changeQty(${d.id},1)">+</button></div><button class="add-btn" onclick="addToCart(${d.id})">Add to cart</button></div></div></article>`).join("")}
window.changeQty=(id,delta)=>{const e=$(`#qty-${id}`);e.textContent=Math.max(1,Math.min(10,+e.textContent+delta))}
window.addToCart=id=>{const d=dishes.find(x=>x.id===id);const qty=+$(`#qty-${id}`).textContent;const restaurant=restaurants.find(r=>r.id===state.currentRestaurantId)||restaurants[0];const old=state.cart.find(x=>x.id===id&&x.restaurantId===restaurant.id);if(old)old.qty=Math.min(10,old.qty+qty);else state.cart.push({...d,qty,restaurantId:restaurant.id,restaurantName:restaurant.name});save();toast(`${d.name} added to cart from ${restaurant.name}`)}
function getDiscount(){let discount=0;state.cart.forEach(item=>{const selected=state.selectedOffers[item.restaurantId]||[];const r=restaurants.find(x=>x.id===item.restaurantId);selected.forEach(oid=>{const o=r?.offers.find(x=>x.id===oid);if(!o)return;if(o.kind==="first")discount+=Math.min(item.price*item.qty*.25,150);else if(o.kind==="upi")discount+=100;else if(o.kind==="time")discount+=item.price*item.qty*.20;else if(o.kind==="dine")discount+=item.price*item.qty*.15;else if(o.kind==="amount"&&item.price*item.qty>=799)discount+=150})});return Math.min(discount,state.cart.reduce((s,x)=>s+x.price*x.qty,0))}
function renderCart(){const el=$("#cartItems");if(!state.cart.length){el.innerHTML='<div class="empty">Your cart is empty.<br><small>Add a dish from a takeout menu.</small></div>';$("#cartSubtotal").textContent=$("#cartFees").textContent=$("#cartDiscount").textContent=$("#cartTotal").textContent="₹0";return}el.innerHTML=state.cart.map(x=>`<div class="cart-item"><img src="${x.image}" alt="${esc(x.name)}"><div><h4>${esc(x.name)}</h4><small>${esc(x.restaurantName)} • ${x.type} • ${x.qty} × ${money(x.price)}</small></div><div><b>${money(x.qty*x.price)}</b><br><button class="remove" onclick="removeCart(${x.id})">remove</button></div></div>`).join("");const sub=state.cart.reduce((s,x)=>s+x.price*x.qty,0),discount=getDiscount(),fees=Math.round((sub-discount)*.05);$("#cartSubtotal").textContent=money(sub);$("#cartFees").textContent=money(fees);$("#cartDiscount").textContent=`− ${money(discount)}`;$("#cartTotal").textContent=money(sub-discount+fees)}
window.removeCart=id=>{state.cart=state.cart.filter(x=>x.id!==id);save();renderCart();toast("Item removed")}
function checkout(){if(!state.cart.length){toast("Add at least one item first.");return}const sub=state.cart.reduce((s,x)=>s+x.price*x.qty,0),discount=getDiscount(),fees=Math.round((sub-discount)*.05),total=sub-discount+fees;const applied=[...new Set(state.cart.flatMap(x=>(state.selectedOffers[x.restaurantId]||[]).map(oid=>restaurants.find(r=>r.id===x.restaurantId)?.offers.find(o=>o.id===oid)?.title).filter(Boolean)))];$("#checkoutContent").innerHTML=`<p class="eyebrow">SECURE CHECKOUT • DEMO</p><h2>Almost at the good part.</h2><div class="checkout-grid"><div class="checkout-card"><h3>Delivery details</h3><div class="form-grid"><label>Name<input id="buyerName" placeholder="Your name"></label><label>Mobile<input id="buyerMobile" maxlength="10" placeholder="10-digit mobile"></label><label>Delivery location<input id="buyerLocation" value="${esc(state.location)}"></label><label>Instructions<input id="instructions" placeholder="Less spicy, call on arrival..."></label></div></div><div class="checkout-card"><h3>Payment</h3><div class="pay-options"><label><input type="radio" name="pay" checked value="UPI"> UPI • instant discount</label><label><input type="radio" name="pay" value="Card"> Credit / Debit card</label><label><input type="radio" name="pay" value="Wallet"> Wallet</label><label><input type="radio" name="pay" value="COD"> Pay on delivery</label></div><p class="offer-applied"><b>Offers applied</b><br>${applied.length?applied.map(esc).join(" • "):"No restaurant offer selected"}</p><div class="checkout-breakdown"><span>Subtotal <b>${money(sub)}</b></span><span>Offer savings <b>− ${money(discount)}</b></span><span>Tax & fees <b>${money(fees)}</b></span><strong>Total <b>${money(total)}</b></strong></div><button class="dark-btn full" onclick="placeOrder()">Place demo order →</button></div></div>`;$("#cartDrawer").classList.remove("open");openModal("#checkoutModal")}
window.placeOrder=()=>{
  const name=$("#buyerName").value.trim()||"Guest";
  const mobile=$("#buyerMobile").value.trim()||"Not provided";
  const sub=state.cart.reduce((s,x)=>s+x.price*x.qty,0),discount=getDiscount(),fees=Math.round((sub-discount)*.05);
  const order={id:"BMS"+Date.now().toString().slice(-6),date:new Date().toLocaleDateString("en-IN"),customer:name,mobile,location:$("#buyerLocation").value||state.location,instructions:$("#instructions").value||"None",payment:document.querySelector('input[name="pay"]:checked').value,total:sub-discount+fees,discount,items:state.cart.map(x=>({name:x.name,qty:x.qty,price:x.price,restaurant:x.restaurantName}))};
  const paymentText=order.payment==="COD"?"Pay on delivery selected":"Demo payment approved";
  $("#checkoutContent").innerHTML=`<div class="payment-processing"><div class="payment-spinner">✓</div><p class="eyebrow">DEMO PAYMENT</p><h2>${paymentText}</h2><p>Processing your ${esc(order.payment)} transaction securely...</p></div>`;
  setTimeout(()=>{
    state.orders.unshift(order); state.cart=[]; save();
    $("#checkoutContent").innerHTML=`<div class="success"><div style="font-size:35px">✓</div><h2>Order confirmed.</h2><p>Order ${order.id} • ETA 25–35 min</p><p>Customer: ${esc(order.customer)} • ${esc(order.location)}</p><p>Payment: ${esc(order.payment)} • Savings: ${money(order.discount)}</p><button class="dark-btn" onclick="closeModals();openOrders()">View order history →</button></div>`;
    toast("Demo payment successful. Order added to history.");
  },900);
}

function openBookings(){renderBookings();openModal("#bookingsModal")}
function renderBookings(){
  const arr=state.bookings;
  $("#bookingsContent").innerHTML=`<p class="eyebrow">TABLE BOOKINGS</p><h2>Your confirmed tables.</h2><p class="muted">Every reservation made through the dine-in flow appears here with the preferences you selected.</p><div id="bookingList">${arr.length?arr.map(bookingCard).join(""):'<div class="empty">No table bookings yet. Choose Dine in from a restaurant to reserve a table.</div>'}</div>`;
}
function bookingCard(b){return `<article class="order-card booking-card"><div class="top"><div><h3>${esc(b.restaurant)}</h3><small>${esc(b.location)} • ${esc(b.date)}</small></div><span class="status-pill">${esc(b.status)}</span></div><p><b>${esc(b.time)}</b> • ${esc(b.people)} people • ${esc(b.preference)}</p><small>Occasion: ${esc(b.occasion)} • Booking ID: ${esc(b.id)}</small></article>`}
function openOrders(){renderOrders();openModal("#ordersModal")}
function renderOrders(){const arr=state.orders;$("#ordersContent").innerHTML=`<p class="eyebrow">ORDER HISTORY</p><h2>Your past bites.</h2><div class="order-filters"><select id="orderPay"><option value="all">All payments</option><option>UPI</option><option>Card</option><option>Wallet</option><option>COD</option></select><select id="orderLocation"><option value="all">All locations</option>${locations.map(l=>`<option>${esc(l)}</option>`).join("")}</select></div><div id="orderList">${arr.length?arr.map(orderCard).join(""): '<div class="empty">No orders yet. Place a demo takeout order to populate history.</div>'}</div>`;$("#orderPay").onchange=filterOrders;$("#orderLocation").onchange=filterOrders}
function orderCard(o){return `<article class="order-card"><div class="top"><div><h3>Order ${esc(o.id)}</h3><small>${esc(o.date)} • ${esc(o.location)}</small></div><b>${money(o.total)}</b></div><p style="font-size:11px">${o.items.map(i=>`${esc(i.name)} × ${i.qty}`).join(" • ")}</p><small>Payment: ${esc(o.payment)} • Takeout • Savings ${money(o.discount||0)}</small></article>`}
function filterOrders(){const p=$("#orderPay").value,l=$("#orderLocation").value;const arr=state.orders.filter(o=>(p==="all"||o.payment===p)&&(l==="all"||o.location===l));$("#orderList").innerHTML=arr.length?arr.map(orderCard).join(""):'<div class="empty">No orders match those filters.</div>'}
function renderReview(){const r=reviews[Math.floor(Math.random()*reviews.length)];$("#reviewCard").innerHTML=`<div class="stars">★★★★★</div><blockquote>“${esc(r.quote)}”</blockquote><div class="reviewer">${esc(r.name)} • Verified demo reviewer</div>`}
init();
