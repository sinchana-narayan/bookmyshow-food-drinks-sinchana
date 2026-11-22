const locations = [
  "Indiranagar, Bengaluru","Koramangala, Bengaluru","HSR Layout, Bengaluru","Whitefield, Bengaluru",
  "Jayanagar, Bengaluru","JP Nagar, Bengaluru","Malleshwaram, Bengaluru","BTM Layout, Bengaluru",
  "Marathahalli, Bengaluru","Kengeri, Bengaluru"
];

const areaPrefixes = {
  "Indiranagar":"Indiranagar", "Koramangala":"Koramangala", "HSR Layout":"HSR", "Whitefield":"Whitefield",
  "Jayanagar":"Jayanagar", "JP Nagar":"JP Nagar", "Malleshwaram":"Malleshwaram", "BTM Layout":"BTM",
  "Marathahalli":"Marathahalli", "Kengeri":"Kengeri"
};

const venueTemplates = [
  ["Spice House","North Indian",4.8,"₹₹",420,"Both"],
  ["Table & Tandoor","Mughlai",4.6,"₹₹₹",650,"Both"],
  ["Wok Garden","Chinese",4.5,"₹₹",380,"Both"],
  ["Biryani Bazaar","Biryani",4.7,"₹₹",450,"Non-Veg"],
  ["Dosa Diaries","South Indian",4.6,"₹",240,"Veg"],
  ["Curry Courtyard","Indian",4.4,"₹₹",520,"Both"],
  ["Chaat & Chai","Street Food",4.3,"₹",220,"Veg"],
  ["Pepper Kitchen","Indo-Chinese",4.5,"₹₹",470,"Both"],
  ["The Food Hall","Multi-cuisine",4.2,"₹₹₹",720,"Both"],
  ["Terrace Tiffin","South Indian",4.7,"₹",280,"Veg"]
];

const restaurantImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1000&q=85"
];

const offers = [
  ["BMS First Bite","25% off up to ₹150","first"],
  ["UPI Feast","₹100 off on UPI orders above ₹499","upi"],
  ["Happy Hour","20% off from 4 PM – 7 PM","time"],
  ["Table Treat","15% off on dine-in bills","dine"],
  ["Weekend Platter","₹150 off above ₹799","amount"]
];

const names = ["Ananya","Rahul","Meera","Arjun","Nisha","Karan","Ishita","Vikram","Pooja","Aditya","Sneha","Rohan"];
const reviewTexts = [
  "Beautiful ambience and the food came out fresh. The portions were generous too.",
  "Loved the service and the atmosphere. The offer made the whole meal feel worth it.",
  "A really convenient place for a casual dinner. Everything was clearly listed.",
  "The signature dishes were excellent and the staff was quick and friendly.",
  "Great option when we wanted both a comfortable table and quick takeout."
];

const restaurantNames = [];
const restaurants = [];
let restaurantId = 1;
locations.forEach((fullLocation, li) => {
  const area = fullLocation.split(",")[0];
  venueTemplates.forEach((t, vi) => {
    const id = restaurantId++;
    const name = t[0];
    const offerA = offers[(li + vi) % offers.length];
    const offerB = offers[(li + vi + 2) % offers.length];
    const signatureDishIds = [1 + ((li * 3 + vi) % 15), 16 + ((li * 2 + vi) % 15), 1 + ((li * 5 + vi + 4) % 15)];
    restaurants.push({
      id,
      name,
      cuisine:t[1], area, rating:t[2], price:t[3], averageCost:t[4], type:t[5],
      image:restaurantImages[(li * 3 + vi) % restaurantImages.length],
      hours: vi % 2 ? "12:00 PM – 11:30 PM" : "11:00 AM – 11:00 PM",
      eta:`${20 + ((li + vi) % 5) * 5}–${30 + ((li + vi) % 5) * 5} min`,
      offers:[
        {id:`${id}-a`,title:offerA[0],text:offerA[1],kind:offerA[2]},
        {id:`${id}-b`,title:offerB[0],text:offerB[1],kind:offerB[2]}
      ],
      signatureDishIds,
      reviews:[0,1,2,3,4].map((n,j)=>({name:names[(id+j)%names.length],rating:Math.max(4,Math.round(t[2] - (j%2)*0.2)),text:reviewTexts[(id+j)%reviewTexts.length]}))
    });
  });
});

const vegDishNames = [
  ["Paneer Tikka","Tandoori paneer, peppers & onions",289,"https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=85"],
  ["Butter Paneer","Paneer in tomato-butter gravy",299,"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85"],
  ["Dal Makhani","Slow-cooked black lentils with butter",249,"https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=85"],
  ["Veg Hakka Noodles","Wok-tossed noodles with vegetables",229,"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85"],
  ["Gobi Manchurian","Crispy cauliflower in Indo-Chinese sauce",239,"https://images.unsplash.com/photo-1625398407796-82650a8c0e75?auto=format&fit=crop&w=700&q=85"],
  ["Masala Dosa","Crisp dosa, potato masala & chutneys",149,"https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=700&q=85"],
  ["Idli Vada Combo","Steamed idli, medu vada & sambar",129,"https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=85"],
  ["Veg Biryani","Fragrant basmati rice, vegetables & herbs",259,"https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=700&q=85"],
  ["Chole Bhature","Spiced chickpeas with fluffy bhature",199,"https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=700&q=85"],
  ["Palak Paneer","Paneer in spinach gravy",279,"https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=85"],
  ["Veg Korma","Mixed vegetables in creamy cashew gravy",289,"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85"],
  ["Mushroom Pepper Fry","Wok-fried mushrooms with black pepper",259,"https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=700&q=85"],
  ["Aloo Gobi","Potato and cauliflower with Indian spices",219,"https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=700&q=85"],
  ["Schezwan Fried Rice","Spicy fried rice with vegetables",249,"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85"],
  ["Veg Momos","Steamed vegetable dumplings with chilli dip",189,"https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=700&q=85"]
];
const nonVegDishNames = [
  ["Chicken Biryani","Hyderabadi-style chicken and basmati rice",329,"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=85"],
  ["Butter Chicken","Charred chicken in silky tomato gravy",349,"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=85"],
  ["Chicken Tikka","Tandoori chicken with mint chutney",319,"https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=85"],
  ["Chicken Hakka Noodles","Wok-tossed noodles with tender chicken",289,"https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=85"],
  ["Chilli Chicken","Crispy chicken, peppers and green chilli",299,"https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=700&q=85"],
  ["Mutton Rogan Josh","Slow-cooked mutton in Kashmiri spices",429,"https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=700&q=85"],
  ["Fish Tikka","Char-grilled fish with lemon and herbs",379,"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=85"],
  ["Chicken 65","Crispy South Indian-style chicken",289,"https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85"],
  ["Egg Fried Rice","Wok-fried rice with egg and spring onion",239,"https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=700&q=85"],
  ["Chicken Momos","Steamed dumplings with chicken filling",229,"https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=700&q=85"],
  ["Pepper Chicken","Black pepper chicken roast",329,"https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=700&q=85"],
  ["Prawn Masala","Coastal prawns in a spiced gravy",449,"https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=700&q=85"],
  ["Chicken Korma","Creamy cashew chicken curry",359,"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=85"],
  ["Mutton Biryani","Aromatic rice with tender mutton",449,"https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=85"],
  ["Andhra Chicken","Fiery Andhra-style chicken curry",339,"https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=85"]
];

const dishes = [
  ...vegDishNames.map((d,i)=>({id:i+1,name:d[0],desc:d[1],price:d[2],type:"Veg",image:d[3],serving:"1 portion"})),
  ...nonVegDishNames.map((d,i)=>({id:i+16,name:d[0],desc:d[1],price:d[2],type:"Non-Veg",image:d[3],serving:"1 portion"}))
];

const reviews = [
  {name:"Sarah Khan",quote:"Amazing food and great service. One of my favorite places."},
  {name:"Rohan Mehta",quote:"The filters actually made finding dinner easy. Loved the takeout ETA."},
  {name:"Priya S.",quote:"Clear offers, good food photos and a very straightforward checkout flow."}
];
